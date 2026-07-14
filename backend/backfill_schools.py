"""
Backfill School records from all existing Submission form data.
Submission.data keys are FormField IDs, not label strings.

Usage: python backfill_schools.py  (from inside the backend/ directory)
"""
import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_core.settings")
django.setup()

from forms.models import Submission, School, Student, FormField

print("Starting school backfill from existing submissions...")
print("(data keys are FormField IDs, resolving labels...)\n")

# Build a cache: field_id -> label
field_label_cache = {str(f.id): f.label for f in FormField.objects.all()}
print(f"Loaded {len(field_label_cache)} form fields: {field_label_cache}\n")

created = 0
linked = 0
skipped = 0

for sub in Submission.objects.select_related("student").all():
    if not sub.data or not isinstance(sub.data, dict):
        skipped += 1
        continue

    school_val = None
    for field_id, val in sub.data.items():
        label = field_label_cache.get(str(field_id), "")
        if "school" in label.lower() and val:
            school_val = str(val).strip()
            break

    if not school_val:
        skipped += 1
        continue

    # Get or create the school (case-insensitive match)
    school_obj = School.objects.filter(name__iexact=school_val).first()
    if not school_obj:
        school_obj = School.objects.create(name=school_val)
        created += 1
        print(f"  ✓ Created school: {school_obj.name}")

    # Link student to school
    student = sub.student
    if student and student.school != school_obj:
        student.school = school_obj
        student.save(update_fields=["school"])
        linked += 1
        print(f"  → Linked student '{student.name}' → '{school_obj.name}'")

print(f"\nDone!")
print(f"  Schools created : {created}")
print(f"  Students linked : {linked}")
print(f"  Skipped (no school field): {skipped}")
