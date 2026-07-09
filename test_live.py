import requests
import json
import time

BASE_URL = "https://orchid-backend-itax.onrender.com"

# 1. Register a new user
email = f"live_test_{int(time.time())}@example.com"
password = "password123"

print(f"Registering {email}...")
reg_res = requests.post(f"{BASE_URL}/api/auth/register/", json={
    "name": "Live Test User",
    "email": email,
    "password": password
})
print("Register:", reg_res.status_code, reg_res.text)
if reg_res.status_code != 201:
    exit(1)

token = reg_res.json()['token']
headers = {"Authorization": f"Token {token}", "Content-Type": "application/json"}

# 2. Check /api/auth/me/
me_res = requests.get(f"{BASE_URL}/api/auth/me/", headers=headers)
print("Auth Me:", me_res.status_code, me_res.text)

# 3. Check active form
active_res = requests.get(f"{BASE_URL}/api/forms/active/", headers=headers)
print("Active Form:", active_res.status_code, active_res.text)
form_id = active_res.json()['id']

# 4. Submit form
submit_res = requests.post(f"{BASE_URL}/api/submit/", headers=headers, json={
    "student_name": "Live Test User",
    "student_email": email,
    "form_id": form_id,
    "data": {"foo": "bar"}
})
print("Submit:", submit_res.status_code, submit_res.text)
