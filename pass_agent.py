import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_core.settings")
import django
django.setup()

from forms.models import Student, Submission
student = Student.objects.get(email="agent_test_3@example.com")
submission = Submission.objects.filter(student=student).first()
submission.marks = 100 # Give full marks
submission.save()
print(f"Agent submission marked as passed: {submission.is_passed}")
