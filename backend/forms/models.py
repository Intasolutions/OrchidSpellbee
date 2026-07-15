from django.db import models
from django.contrib.auth.models import User
class TierForm(models.Model):
    name = models.CharField(max_length=100) # e.g., "School Level", "District Level"
    description = models.TextField(blank=True)
    entry_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0) # To define progression order
    total_marks = models.IntegerField(default=100)
    pass_percentage = models.IntegerField(default=40)

    def __str__(self):
        return self.name

class FormField(models.Model):
    FIELD_TYPES = (
        ('text', 'Text'),
        ('email', 'Email'),
        ('number', 'Number'),
        ('select', 'Dropdown'),
    )
    form = models.ForeignKey(TierForm, related_name='fields', on_delete=models.CASCADE)
    label = models.CharField(max_length=100)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES, default='text')
    options = models.TextField(blank=True, help_text="Comma separated options for dropdowns")
    required = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    depends_on = models.CharField(max_length=100, null=True, blank=True, help_text="Label of the field this depends on")
    depends_on_value = models.CharField(max_length=100, null=True, blank=True, help_text="Value the parent field must have")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.form.name} - {self.label}"

class Agent(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class School(models.Model):
    name = models.CharField(max_length=200, unique=True)
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, blank=True, related_name='schools')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='student_profile')
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    current_tier = models.ForeignKey(TierForm, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    student_code = models.CharField(max_length=50, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.student_code:
            from django.utils import timezone
            self.student_code = f"OSB-{self.created_at.year if self.created_at else timezone.now().year}-{self.id:04d}"
            super().save(update_fields=['student_code'])

    def __str__(self):
        return self.name

class Submission(models.Model):
    student = models.ForeignKey(Student, related_name='submissions', on_delete=models.CASCADE)
    form = models.ForeignKey(TierForm, on_delete=models.CASCADE)
    data = models.JSONField(default=dict) # Stores the answers
    payment_status = models.CharField(max_length=20, default='PENDING', choices=[('PENDING', 'Pending'), ('PAID', 'Paid')])
    
    # Razorpay Payment Fields
    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=255, null=True, blank=True)
    
    marks = models.FloatField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Check if submission has school name in data.
        # data keys are FormField IDs (e.g. {'7': 'John', '5': 'My School'})
        if self.data and isinstance(self.data, dict):
            school_val = None
            for field_id, val in self.data.items():
                try:
                    field = FormField.objects.get(id=int(field_id))
                    if 'school' in field.label.lower() and val:
                        school_val = str(val).strip()
                        break
                except (FormField.DoesNotExist, ValueError, TypeError):
                    # Fallback: if key itself contains "school" (legacy label-based data)
                    if 'school' in str(field_id).lower() and val:
                        school_val = str(val).strip()
                        break

            if school_val:
                school_obj = School.objects.filter(name__iexact=school_val).first()
                if not school_obj:
                    school_obj = School.objects.create(name=school_val)

                student = self.student
                if student and student.school != school_obj:
                    student.school = school_obj
                    student.save(update_fields=['school'])

    @property
    def is_passed(self):
        if self.marks is None:
            return None
        if self.form.total_marks <= 0:
            return True
        percentage = (self.marks / self.form.total_marks) * 100
        return percentage >= self.form.pass_percentage

    def __str__(self):
        return f"{self.student.name} - {self.form.name}"

class SiteSettings(models.Model):
    is_registration_active = models.BooleanField(default=True, help_text="Toggle global registration on/off")

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SiteSettings, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Global Site Settings"

class GalleryItem(models.Model):
    title = models.CharField(max_length=200, blank=True, null=True, help_text="Optional title or alt text")
    media_file = models.FileField(upload_to='gallery/')
    is_video = models.BooleanField(default=False, help_text="Check if this is a video file (mp4, webm)")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Order in which it appears")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title or f"Gallery Media {self.id}"
