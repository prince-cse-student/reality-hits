import httpx
import json
import re
import logging
from config import LM_STUDIO_API_URL
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
    """Extract JSON from LM Studio response, even if wrapped in markdown or extra text"""

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


async def analyze_complaint_with_ai(
    complaint_text: str, location: str, language: str = "English"
) -> Dict[str, Any]:
    """
    Analyze complaint using LM Studio local API.
    Returns category, priority, department, reasoning, summary, and confidence.
    """

    model = await get_loaded_model()

    prompt = f"""You are an AI assistant for a government grievance system called "CitizenVoice".
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
                return get_default_analysis()

            data = response.json()
            content = data["choices"][0]["message"]["content"].strip()
            logger.info(f"LM Studio raw response: {content[:200]}")

            # Parse JSON from response
            analysis = extract_json_from_response(content)

            if analysis:
                return {
                    "category": analysis.get("category", "Other"),
                    "priority": analysis.get("priority", "Medium"),
                    "department": analysis.get("department", "General Department"),
                    "reason": analysis.get("reason", "Complaint analyzed and categorized"),
                    "summary": analysis.get("summary", complaint_text[:100]),
                    "confidence": int(analysis.get("confidence", 85)),
                }
            else:
                logger.warning(f"Could not parse JSON from LM Studio response: {content}")
                return get_default_analysis()

    except httpx.ConnectError:
        logger.error("LM Studio is not running. Start LM Studio on port 1234.")
        return get_default_analysis()

    except httpx.TimeoutException:
        logger.error("LM Studio request timed out after 60s")
        return get_default_analysis()

    except Exception as e:
        logger.error(f"Error analyzing complaint: {e}")
        return get_default_analysis()


def get_default_analysis() -> Dict[str, Any]:
    """Return default analysis when LM Studio is unavailable"""
    return {
        "category": "Other",
        "priority": "Medium",
        "department": "General Grievance Department",
        "reason": "AI analysis unavailable — complaint will be manually reviewed",
        "summary": "Pending manual review",
        "confidence": 0,
    }
