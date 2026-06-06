import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from forms.models import TierForm, FormField

def populate():
    form, created = TierForm.objects.get_or_create(
        name="School Level",
        defaults={
            "description": "Initial entry level for the spelling bee.",
            "entry_fee": 500.00,
            "is_active": True,
            "order": 1
        }
    )
    if created:
        FormField.objects.create(form=form, label="Student Name", field_type="text", order=1)
        FormField.objects.create(form=form, label="Grade/Class", field_type="select", options="Class 1,Class 2,Class 3", order=2)
        FormField.objects.create(form=form, label="School Name", field_type="text", order=3)
        print("Successfully created School Level form and fields.")
    else:
        print("Form already exists.")

if __name__ == '__main__':
    populate()
