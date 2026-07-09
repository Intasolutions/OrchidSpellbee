from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TierForm, FormField, Student, Submission

class FormFieldSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = FormField
        fields = ['id', 'label', 'field_type', 'options', 'required', 'order', 'depends_on', 'depends_on_value']

class TierFormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)

    class Meta:
        model = TierForm
        fields = ['id', 'name', 'description', 'entry_fee', 'is_active', 'order', 'fields', 'total_marks', 'pass_percentage']

class AdminTierFormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True)

    class Meta:
        model = TierForm
        fields = ['id', 'name', 'description', 'entry_fee', 'is_active', 'order', 'fields', 'total_marks', 'pass_percentage']

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
        instance.total_marks = validated_data.get('total_marks', instance.total_marks)
        instance.pass_percentage = validated_data.get('pass_percentage', instance.pass_percentage)
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
        fields = ['id', 'name', 'email', 'student_code', 'current_tier', 'current_tier_name', 'created_at', 'is_deleted', 'deleted_at']

class StudentRegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        student = Student.objects.create(
            user=user,
            name=validated_data['name'],
            email=validated_data['email']
        )
        return student
class SubmissionCreateSerializer(serializers.Serializer):
    student_name = serializers.CharField(max_length=200, required=False) # Keep for compatibility, but ignored
    student_email = serializers.EmailField(required=False, allow_blank=True) # Keep for compatibility, but ignored
    form_id = serializers.IntegerField()
    data = serializers.JSONField()

    def create(self, validated_data):
        request = self.context.get('request')
        
        if not request or not request.user.is_authenticated or not hasattr(request.user, 'student_profile'):
            raise serializers.ValidationError("Authentication required. You must be logged in as a student to submit this form.")
            
        student = request.user.student_profile

        try:
            tier_form = TierForm.objects.get(id=validated_data['form_id'])
        except TierForm.DoesNotExist:
            raise serializers.ValidationError("Invalid form_id")
        
        student.current_tier = tier_form
        student.save()

        payment_status = 'PAID' if tier_form.entry_fee <= 0 else 'PENDING'

        submission = Submission.objects.create(
            student=student,
            form=tier_form,
            data=validated_data['data'],
            payment_status=payment_status
        )
        return submission

class SubmissionListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_email = serializers.EmailField(source='student.email', read_only=True)
    student_code = serializers.CharField(source='student.student_code', read_only=True)
    form_name = serializers.CharField(source='form.name', read_only=True)
    entry_fee = serializers.DecimalField(source='form.entry_fee', max_digits=10, decimal_places=2, read_only=True)
    is_passed = serializers.BooleanField(read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'student_name', 'student_email', 'student_code', 'form_name', 'entry_fee', 'data', 'payment_status', 'marks', 'is_passed', 'submitted_at']

