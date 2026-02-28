"""
Quick seed script to populate history for the currently logged-in user.
This uses the updated API endpoints that require authentication.

Usage:
  1. Make sure you're logged in to the frontend (http://localhost:3000)
  2. Open DevTools (F12) → Console tab
  3. Run this command to get your auth token:
     
     localStorage.getItem('authToken')
     
  4. Copy the token and replace YOUR_AUTH_TOKEN below
  5. Run: python seed_current_user_history.py
"""

import requests
import json

# Replace with your actual auth token from localStorage
AUTH_TOKEN = input("Enter your Firebase Auth Token (from localStorage.getItem('authToken')): ").strip()

if not AUTH_TOKEN:
    print("❌ No token provided!")
    exit(1)

BASE_URL = "http://localhost:8000"
headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}

print("\n" + "="*80)
print("SEEDING HISTORY DATA FOR YOUR ACCOUNT")
print("="*80 + "\n")

# Test authentication first
print("1️⃣  Testing authentication...")
try:
    response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
    if response.status_code == 200:
        user_data = response.json()
        print(f"   ✅ Authenticated as: {user_data.get('email', 'Unknown')}")
        user_id = user_data.get('id', user_data.get('firebase_uid', 'Unknown'))
        print(f"   User ID: {user_id}\n")
    else:
        print(f"   ❌ Authentication failed: {response.status_code}")
        print(f"   Response: {response.text}")
        exit(1)
except Exception as e:
    print(f"   ❌ Error: {e}")
    exit(1)

# Seed dashboard test data
print("2️⃣  Seeding 9 sample history records...")
try:
    response = requests.post(
        f"{BASE_URL}/api/history/seed-dashboard-test",
        headers=headers
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✅ Success!")
        print(f"   Message: {result.get('message')}")
        print(f"   Records inserted: {result.get('inserted_count')}\n")
    else:
        print(f"   ❌ Failed: {response.status_code}")
        print(f"   Response: {response.text}\n")
        exit(1)
except Exception as e:
    print(f"   ❌ Error: {e}\n")
    exit(1)

print("="*80)
print("✅ DONE! Your history has been populated.")
print("="*80)
print("\nNow try:")
print("  • Refresh the History page in your browser")
print("  • You should see 9 sample records organized by feature type")
print("  • Total Activities should show: 9")
print("  • Success Rate should show: 100%")
print("\n")
