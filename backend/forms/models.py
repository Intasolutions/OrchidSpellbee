from django.db import models

class TierForm(models.Model):
    name = models.CharField(max_length=100) # e.g., "School Level", "District Level"
    description = models.TextField(blank=True)
    entry_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0) # To define progression order

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

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.form.name} - {self.label}"

class Student(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    current_tier = models.ForeignKey(TierForm, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class Submission(models.Model):
    student = models.ForeignKey(Student, related_name='submissions', on_delete=models.CASCADE)
    form = models.ForeignKey(TierForm, on_delete=models.CASCADE)
    data = models.JSONField(default=dict) # Stores the answers
    payment_status = models.CharField(max_length=20, default='PENDING', choices=[('PENDING', 'Pending'), ('PAID', 'Paid')])
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} - {self.form.name}"
