from django.contrib import admin
from .models import TierForm, FormField, Student, Submission

class FormFieldInline(admin.StackedInline):
    model = FormField
    fields = ('label', 'field_type', 'options', 'required', 'order', 'depends_on', 'depends_on_value')
    extra = 1

@admin.register(TierForm)
class TierFormAdmin(admin.ModelAdmin):
    list_display = ('name', 'entry_fee', 'is_active', 'order', 'total_marks', 'pass_percentage')
    inlines = [FormFieldInline]

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'current_tier', 'created_at')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'form', 'payment_status', 'marks', 'is_passed_status', 'submitted_at')
    list_filter = ('form', 'payment_status')
    list_editable = ('marks', 'payment_status')
    search_fields = ('student__name', 'student__email')

    def is_passed_status(self, obj):
        if obj.is_passed is None:
            return "Pending Grading"
        return "Passed" if obj.is_passed else "Failed"
    is_passed_status.short_description = "Result"
