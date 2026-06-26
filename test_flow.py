import requests
import json
import time
import os
import sys

BASE_URL = "http://127.0.0.1:8000"

print("--- Testing Tier Progression Flow ---")

# 1. Register a new student
email = f"testuser_{int(time.time())}@example.com"
password = "testpassword123"
print(f"Registering student: {email}")

res = requests.post(f"{BASE_URL}/api/auth/register/", json={
    "name": "Flow Test User",
    "email": email,
    "password": password
})

if res.status_code != 201:
    print(f"Registration failed: {res.text}")
    exit(1)

token = res.json()["token"]
headers = {"Authorization": f"Token {token}"}
print("Registration successful!")

# 2. Check active form (Should be District - Order 1)
res = requests.get(f"{BASE_URL}/api/forms/active/", headers=headers)
form_data = res.json()
print(f"Active form before submission: {form_data.get('name')}")
form_id = form_data.get('id')

# 3. Submit the form
print("Submitting the District form...")
payload = {
    "student_name": "Flow Test User",
    "form_id": form_id,
    "data": {"School Name": "Test School"}
}
res = requests.post(f"{BASE_URL}/api/submit/", json=payload, headers=headers)
if res.status_code == 201:
    print("Form submitted successfully!")
else:
    print(f"Submission failed: {res.text}")
    exit(1)

# 4. Use Django shell to pass the submission automatically
print("Simulating Admin grading the submission...")
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_core.settings")
import django
django.setup()

from forms.models import Student, Submission
student = Student.objects.get(email=email)
submission = Submission.objects.filter(student=student).first()
submission.marks = 100 # Give full marks
submission.save()
print(f"Submission marked as passed? {submission.is_passed}")

# 5. Check active form again! (Should be State)
res = requests.get(f"{BASE_URL}/api/forms/active/", headers=headers)
new_form_data = res.json()
print(f"Active form AFTER passing: {new_form_data.get('name')}")
