from rest_framework import serializers
from .models import TierForm, FormField, Student, Submission

class FormFieldSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = FormField
        fields = ['id', 'label', 'field_type', 'options', 'required', 'order']

class TierFormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)

    class Meta:
        model = TierForm
        fields = ['id', 'name', 'description', 'entry_fee', 'is_active', 'order', 'fields']

class AdminTierFormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True)

    class Meta:
        model = TierForm
        fields = ['id', 'name', 'description', 'entry_fee', 'is_active', 'order', 'fields']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields', [])
        form = TierForm.objects.create(**validated_data)
        for field_data in fields_data:
            FormField.objects.create(form=form, **field_data)
        return form

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', [])
        
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.entry_fee = validated_data.get('entry_fee', instance.entry_fee)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.order = validated_data.get('order', instance.order)
        instance.save()

        # Simple and clean recreate of dynamic fields
        instance.fields.all().delete()
        for field_data in fields_data:
            field_data.pop('id', None)
            FormField.objects.create(form=instance, **field_data)
            
        return instance

class StudentSerializer(serializers.ModelSerializer):
    current_tier_name = serializers.CharField(source='current_tier.name', read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'current_tier', 'current_tier_name', 'created_at']

class SubmissionCreateSerializer(serializers.Serializer):
    student_name = serializers.CharField(max_length=200)
    student_email = serializers.EmailField(required=False, allow_blank=True)
    form_id = serializers.IntegerField()
    data = serializers.JSONField()

    def create(self, validated_data):
        email = validated_data.get('student_email', '')
        if not email:
            import time
            email = f"student_{int(time.time())}@example.com"
            
        student, _ = Student.objects.get_or_create(
            email=email,
            defaults={'name': validated_data.get('student_name', 'Unknown Student')}
        )
        try:
            tier_form = TierForm.objects.get(id=validated_data['form_id'])
        except TierForm.DoesNotExist:
            raise serializers.ValidationError("Invalid form_id")
        
        student.current_tier = tier_form
        student.save()

        submission = Submission.objects.create(
            student=student,
            form=tier_form,
            data=validated_data['data']
        )
        return submission

class SubmissionListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_email = serializers.EmailField(source='student.email', read_only=True)
    form_name = serializers.CharField(source='form.name', read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'student_name', 'student_email', 'form_name', 'data', 'payment_status', 'submitted_at']
