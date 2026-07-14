from django.core.management.base import BaseCommand
from forms.models import Submission, School, Student, FormField


class Command(BaseCommand):
    help = "Backfill School records from all existing Submission form data"

    def handle(self, *args, **options):
        self.stdout.write("Starting school backfill from existing submissions...")

        # Build field_id -> label cache
        field_label_cache = {str(f.id): f.label for f in FormField.objects.all()}
        self.stdout.write(f"Found {len(field_label_cache)} form fields: {field_label_cache}")

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

            # Get or create school (case-insensitive)
            school_obj = School.objects.filter(name__iexact=school_val).first()
            if not school_obj:
                school_obj = School.objects.create(name=school_val)
                created += 1
                self.stdout.write(self.style.SUCCESS(f"  Created school: {school_obj.name}"))

            # Link student to school
            student = sub.student
            if student and student.school != school_obj:
                student.school = school_obj
                student.save(update_fields=["school"])
                linked += 1
                self.stdout.write(f"  Linked: {student.name} → {school_obj.name}")

        self.stdout.write(self.style.SUCCESS(
            f"\nDone! Schools created: {created} | Students linked: {linked} | Skipped: {skipped}"
        ))
