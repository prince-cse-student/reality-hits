import httpx
import json
import re
import logging
from config import GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL, LM_STUDIO_API_URL
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# LM Studio base URL (strip the endpoint path)
LM_STUDIO_BASE = LM_STUDIO_API_URL.replace("/v1/chat/completions", "")

# Cache the loaded model name
_cached_model: Optional[str] = None


async def get_loaded_model() -> str:
    """Auto-detect which model is loaded in LM Studio"""
    global _cached_model

    if _cached_model:
        return _cached_model

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(f"{LM_STUDIO_BASE}/v1/models")

            if response.status_code == 200:
                data = response.json()
                models = data.get("data", [])

                if models:
                    _cached_model = models[0]["id"]
                    logger.info(f"LM Studio model detected: {_cached_model}")
                    return _cached_model

    except Exception as e:
        logger.warning(f"Could not detect LM Studio model: {e}")

    return "local-model"


async def check_lm_studio_health() -> Dict[str, Any]:
    """Check if LM Studio is running and responsive"""
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(f"{LM_STUDIO_BASE}/v1/models")

            if response.status_code == 200:
                data = response.json()
                models = data.get("data", [])
                return {
                    "status": "online",
                    "models_loaded": len(models),
                    "model_name": models[0]["id"] if models else "none",
                }

    except httpx.ConnectError:
        return {"status": "offline", "error": "LM Studio is not running on port 1234"}
    except Exception as e:
        return {"status": "error", "error": str(e)}

    return {"status": "offline", "error": "Unknown error"}


def extract_json_from_response(text: str) -> Optional[Dict]:
    """Extract JSON from an LLM response, even if wrapped in markdown or extra text."""

    # Try direct parse first
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code block ```json ... ```
    json_block = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if json_block:
        try:
            return json.loads(json_block.group(1))
        except json.JSONDecodeError:
            pass

    # Try finding raw JSON object in text
    json_match = re.search(r"\{[^{}]*\}", text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            pass

    return None


def build_classification_prompt(complaint_text: str, location: str, language: str) -> str:
    return f"""You are an AI assistant for a government grievance system called "CitizenVoice".
Analyze the following citizen complaint and classify it.

Complaint: {complaint_text}
Location: {location}
Language: {language}

You MUST respond with ONLY a JSON object in this exact format, no other text:
{{
  "category": "<one of: Electricity, Water, Roads, Garbage, Sanitation, Transport, Noise, Safety, Other>",
  "priority": "<one of: High, Medium, Low>",
  "department": "<relevant government department name>",
  "reason": "<brief 1-2 sentence explanation>",
  "summary": "<one line summary of the complaint>",
  "confidence": <number between 70 and 99>
}}"""


def normalize_analysis(analysis: Dict[str, Any], complaint_text: str) -> Dict[str, Any]:
    try:
        confidence = int(analysis.get("confidence", 85))
    except (TypeError, ValueError):
        confidence = 85

    return {
        "category": analysis.get("category", "Other"),
        "priority": analysis.get("priority", "Medium"),
        "department": analysis.get("department", "General Department"),
        "reason": analysis.get("reason", "Complaint analyzed and categorized"),
        "summary": analysis.get("summary", complaint_text[:100]),
        "confidence": confidence,
    }


async def analyze_with_lm_studio(
    prompt: str, complaint_text: str
) -> Optional[Dict[str, Any]]:
    model = await get_loaded_model()

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                LM_STUDIO_API_URL,
                json={
                    "model": model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a complaint classification AI. Always respond with valid JSON only.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.2,
                    "max_tokens": 400,
                    "stream": False,
                },
            )

            if response.status_code != 200:
                logger.error(f"LM Studio returned status {response.status_code}: {response.text}")
                return None

            data = response.json()
            content = data["choices"][0]["message"]["content"].strip()
            logger.info(f"LM Studio raw response: {content[:200]}")

            # Parse JSON from response
            analysis = extract_json_from_response(content)

            if analysis:
                return normalize_analysis(analysis, complaint_text)

            logger.warning(f"Could not parse JSON from LM Studio response: {content}")
            return None

    except httpx.ConnectError:
        logger.error("LM Studio is not running. Start LM Studio on port 1234.")
        return None

    except httpx.TimeoutException:
        logger.error("LM Studio request timed out after 60s")
        return None

    except Exception as e:
        logger.error(f"Error analyzing complaint: {e}")
        return None


async def analyze_with_gemini(
    prompt: str, complaint_text: str
) -> Optional[Dict[str, Any]]:
    if not GEMINI_API_KEY:
        logger.warning("Gemini fallback skipped because GEMINI_API_KEY is not set")
        return None

    try:
        async with httpx.AsyncClient(timeout=45) as client:
            response = await client.post(
                GEMINI_API_URL,
                headers={
                    "Authorization": f"Bearer {GEMINI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GEMINI_MODEL,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a complaint classification AI. Always respond with valid JSON only.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.2,
                    "max_tokens": 400,
                    "stream": False,
                },
            )

            if response.status_code != 200:
                logger.error(f"Gemini returned status {response.status_code}: {response.text}")
                return None

            data = response.json()
            content = data["choices"][0]["message"]["content"].strip()
            logger.info(f"Gemini raw response: {content[:200]}")

            analysis = extract_json_from_response(content)
            if analysis:
                return normalize_analysis(analysis, complaint_text)

            logger.warning(f"Could not parse JSON from Gemini response: {content}")
            return None

    except httpx.TimeoutException:
        logger.error("Gemini request timed out after 45s")
        return None

    except Exception as e:
        logger.error(f"Error analyzing complaint with Gemini: {e}")
        return None


async def analyze_complaint_with_ai(
    complaint_text: str, location: str, language: str = "English"
) -> Dict[str, Any]:
    """
    Analyze complaint with LM Studio first, Gemini second, and manual review last.
    Returns category, priority, department, reasoning, summary, and confidence.
    """

    prompt = build_classification_prompt(complaint_text, location, language)

    lm_studio_analysis = await analyze_with_lm_studio(prompt, complaint_text)
    if lm_studio_analysis:
        return lm_studio_analysis

    gemini_analysis = await analyze_with_gemini(prompt, complaint_text)
    if gemini_analysis:
        return gemini_analysis

    return get_default_analysis()


def get_default_analysis() -> Dict[str, Any]:
    """Return default analysis when all AI providers are unavailable."""
    return {
        "category": "Other",
        "priority": "Medium",
        "department": "General Grievance Department",
        "reason": "AI analysis unavailable - complaint will be manually reviewed",
        "summary": "Pending manual review",
        "confidence": 0,
    }
