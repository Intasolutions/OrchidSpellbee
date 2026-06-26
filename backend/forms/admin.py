from django.contrib import admin
from .models import TierForm, FormField, Student, Submission

class FormFieldInline(admin.TabularInline):
    model = FormField
    fields = ('label', 'field_type', 'options', 'required', 'order', 'depends_on', 'depends_on_value')
    extra = 1

@admin.register(TierForm)
class TierFormAdmin(admin.ModelAdmin):
    list_display = ('name', 'entry_fee', 'is_active', 'order')
    inlines = [FormFieldInline]

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'current_tier', 'created_at')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'form', 'payment_status', 'submitted_at')
    list_filter = ('form', 'payment_status')
