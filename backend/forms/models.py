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

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='student_profile')
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
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
    marks = models.FloatField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

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
