import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from forms.models import School, Student, Submission

print("Scanning existing submissions to link schools...")
submissions = Submission.objects.all()
linked_count = 0

for sub in submissions:
    if sub.data and isinstance(sub.data, dict):
        school_val = None
        for key, val in sub.data.items():
            if 'school' in key.lower():
                school_val = str(val).strip()
                break
        if school_val:
            school_obj = School.objects.filter(name__iexact=school_val).first()
            if not school_obj:
                school_obj = School.objects.create(name=school_val)
                print(f"Created School: {school_val}")
            
            student = sub.student
            if student.school != school_obj:
                student.school = school_obj
                student.save(update_fields=['school'])
                linked_count += 1

print(f"Done! Linked {linked_count} students to their respective schools.")
