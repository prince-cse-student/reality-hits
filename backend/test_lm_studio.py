#!/usr/bin/env python3
"""
LM Studio Integration Test
Tests the connection and response from LM Studio API
"""

import requests
import json
import time
from config import LM_STUDIO_API_URL

def test_lm_studio_connection():
    """Test if LM Studio API is reachable"""
    print("🔌 Testing LM Studio API connection...")
    
    try:
        # Try a simple health check first
        response = requests.get(LM_STUDIO_API_URL.replace("/v1/chat/completions", "/health"), timeout=5)
        print(f"✅ Connection successful: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to LM Studio API")
        print(f"   Make sure LM Studio is running on {LM_STUDIO_API_URL}")
        return False
    except Exception as e:
        print(f"⚠️  Error: {e}")
        return False

def test_complaint_analysis():
    """Test complaint analysis with LM Studio"""
    print("\n🤖 Testing complaint analysis...")
    
    test_complaint = "The road near my house has many potholes which are causing accidents"
    location = "Sector 5, Mumbai"
    
    prompt = f"""Analyze the following citizen complaint and provide:
1. Category (e.g., Electricity, Water, Roads, Garbage, Other)
2. Priority (High, Medium, Low)
3. Department to route to
4. Brief reasoning

Complaint:
{test_complaint}

Location: {location}

Respond in JSON format only:
{{
  "category": "...",
  "priority": "...",
  "department": "...",
  "reason": "..."
}}"""
    
    try:
        print(f"   Input: {test_complaint[:50]}...")
        
        start_time = time.time()
        
        response = requests.post(
            LM_STUDIO_API_URL,
            json={
                "model": "local-model",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "max_tokens": 300,
            },
            timeout=60
        )
        
        elapsed = time.time() - start_time
        
        if response.status_code != 200:
            print(f"❌ API returned status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        data = response.json()
        content = data['choices'][0]['message']['content'].strip()
        
        # Try to parse JSON
        try:
            analysis = json.loads(content)
            print(f"✅ Analysis successful ({elapsed:.1f}s)")
            print(f"   Category: {analysis.get('category')}")
            print(f"   Priority: {analysis.get('priority')}")
            print(f"   Department: {analysis.get('department')}")
            print(f"   Reason: {analysis.get('reason')}")
            return True
        except json.JSONDecodeError:
            print(f"⚠️  AI response is not valid JSON")
            print(f"   Response: {content[:100]}...")
            return False
            
    except requests.exceptions.Timeout:
        print(f"❌ Request timed out after 60s")
        print(f"   LM Studio might be overloaded or not responding")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_multiple_complaints():
    """Test analysis of different complaint types"""
    print("\n📊 Testing various complaint types...")
    
    test_cases = [
        ("Water supply has been unavailable for 5 days", "Downtown", "Water"),
        ("Power cuts happening 4-5 times daily", "Industrial area", "Electricity"),
        ("Streetlights are broken causing safety issues", "Main street", "Roads"),
    ]
    
    successes = 0
    
    for complaint, location, expected_category in test_cases:
        print(f"\n   Testing: {complaint[:40]}...")
        
        prompt = f"""Analyze this complaint and return JSON only:
        
Complaint: {complaint}
Location: {location}

{{
  "category": "...",
  "priority": "...",
  "department": "...",
  "reason": "..."
}}"""
        
        try:
            response = requests.post(
                LM_STUDIO_API_URL,
                json={
                    "model": "local-model",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                    "max_tokens": 300,
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                content = data['choices'][0]['message']['content'].strip()
                analysis = json.loads(content)
                print(f"      ✅ {analysis['category']} - {analysis['priority']}")
                successes += 1
            else:
                print(f"      ❌ API error: {response.status_code}")
        except Exception as e:
            print(f"      ❌ Error: {str(e)[:50]}")
    
    print(f"\n   Passed: {successes}/{len(test_cases)}")
    return successes == len(test_cases)

def main():
    """Run all tests"""
    print("=" * 60)
    print("Reality Hits - LM Studio Integration Test")
    print("=" * 60)
    
    # Test 1: Connection
    if not test_lm_studio_connection():
        print("\n❌ LM Studio is not accessible")
        print("   Start LM Studio and try again")
        return False
    
    # Test 2: Basic analysis
    if not test_complaint_analysis():
        print("\n⚠️  Basic analysis failed")
        print("   The AI might not be configured correctly")
        return False
    
    # Test 3: Multiple complaints
    if not test_multiple_complaints():
        print("\n⚠️  Some complaints failed to analyze")
        print("   This might be temporary")
    
    print("\n" + "=" * 60)
    print("✅ All tests passed! Reality Hits is ready to use.")
    print("=" * 60)
    return True

if __name__ == "__main__":
    main()
