from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TierForm, FormField, Student, Submission, SiteSettings, Agent, School

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = ['is_registration_active', 'is_results_published']


class FormFieldSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = FormField
        fields = ['id', 'label', 'field_type', 'options', 'required', 'order', 'depends_on', 'depends_on_value', 'validation_pattern', 'validation_message', 'force_uppercase']

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

class AgentSerializer(serializers.ModelSerializer):
    schools_count = serializers.SerializerMethodField()

    class Meta:
        model = Agent
        fields = ['id', 'name', 'email', 'phone', 'schools_count', 'created_at']

    def get_schools_count(self, obj):
        return obj.schools.count()

class SchoolSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='agent.name', read_only=True)
    students_count = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    district = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = ['id', 'name', 'agent', 'agent_name', 'students_count', 'state', 'district', 'created_at']

    def get_students_count(self, obj):
        return obj.students.filter(is_deleted=False).count()

    def _get_labeled_data(self, obj):
        if not hasattr(obj, '_cached_labeled_data'):
            student = obj.students.filter(is_deleted=False).first()
            obj._cached_labeled_data = {}
            if student:
                submission = student.submissions.first()
                if submission:
                    field_map = {str(field.id): field.label for field in submission.form.fields.all()}
                    for key, val in submission.data.items():
                        label = field_map.get(str(key), str(key))
                        obj._cached_labeled_data[label] = val
        return obj._cached_labeled_data

    def get_state(self, obj):
        data = self._get_labeled_data(obj)
        return data.get('State') or data.get('state')

    def get_district(self, obj):
        data = self._get_labeled_data(obj)
        return data.get('District') or data.get('district')

class StudentSerializer(serializers.ModelSerializer):
    current_tier_name = serializers.CharField(source='current_tier.name', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    agent_id = serializers.IntegerField(source='school.agent.id', read_only=True, allow_null=True)
    agent_name = serializers.CharField(source='school.agent.name', read_only=True, allow_null=True)

    class Meta:
        model = Student
        fields = [
            'id', 'name', 'email', 'student_code', 
            'school', 'school_name', 'agent_id', 'agent_name',
            'current_tier', 'current_tier_name', 'created_at', 
            'is_deleted', 'deleted_at'
        ]

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

class AdminRegistrationCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    form_id = serializers.IntegerField()
    payment_status = serializers.ChoiceField(choices=['PENDING', 'PAID', 'FAILED', 'NO PAYMENT'], default='PAID')
    password = serializers.CharField(required=False, allow_blank=True) # allow overriding default
    data = serializers.JSONField(required=False, default=dict)

    def create(self, validated_data):
        email = validated_data['email'].strip()
        name = validated_data['name'].strip()
        form_id = validated_data['form_id']
        payment_status = validated_data.get('payment_status', 'PAID')
        password = validated_data.get('password') or 'Orchid@123'
        
        try:
            tier_form = TierForm.objects.get(id=form_id)
        except TierForm.DoesNotExist:
            raise serializers.ValidationError({"form_id": "Invalid form_id"})

        import uuid
        
        # Check if a student with this exact name and email already exists in the database
        existing_student = Student.objects.filter(
            name__iexact=name,
            email__iexact=email
        ).first()

        if existing_student:
            email_to_use = existing_student.user.username if existing_student.user else existing_student.email
        else:
            email_to_use = email
            username_part, domain_part = email.split('@') if '@' in email else (email, 'orchidspellbee.com')
            # Loop to ensure we generate a truly unique username (for User.username)
            while True:
                user_exists = User.objects.filter(username__iexact=email_to_use).exists()
                if not user_exists:
                    break
                # Otherwise, append a unique suffix to the username
                email_to_use = f"{username_part}+{uuid.uuid4().hex[:6]}@{domain_part}"

        # Get or create User
        user, created_user = User.objects.get_or_create(
            username=email_to_use,
            defaults={'email': email_to_use}
        )
        if created_user:
            user.set_password(password)
            user.save()

        # Get or create Student profile
        student, created_student = Student.objects.get_or_create(
            user=user,
            defaults={
                'name': name,
                'email': email,
                'current_tier': tier_form
            }
        )
        if not created_student:
            student.current_tier = tier_form
            student.save()

        # Get or create Submission to make it idempotent and avoid duplicates
        submission, created_sub = Submission.objects.get_or_create(
            student=student,
            form=tier_form,
            defaults={
                'data': validated_data.get('data', {}),
                'payment_status': payment_status
            }
        )
        return submission

class AdminBulkRegistrationSerializer(serializers.Serializer):
    registrations = AdminRegistrationCreateSerializer(many=True)

    def create(self, validated_data):
        created_submissions = []
        for reg_data in validated_data['registrations']:
            # Call the inner serializer's create directly
            # This is okay because we're inside a transaction at the view level
            serializer = AdminRegistrationCreateSerializer(data=reg_data)
            if serializer.is_valid():
                sub = serializer.save()
                created_submissions.append(sub)
        return created_submissions

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
    labeled_data = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = ['id', 'student_name', 'student_email', 'student_code', 'form_name', 'entry_fee', 'data', 'labeled_data', 'payment_status', 'marks', 'is_passed', 'submitted_at']

    def get_labeled_data(self, obj):
        # Build a map of field_id (as string) -> label from the form's fields
        field_map = {str(field.id): field.label for field in obj.form.fields.all()}
        result = {}
        for key, value in obj.data.items():
            label = field_map.get(str(key), str(key))  # fallback to raw key if not found
            result[label] = value
        return result


class AdminMarksUpdateSerializer(serializers.Serializer):
    osb_id = serializers.CharField(max_length=100)
    mark = serializers.FloatField()
    level = serializers.CharField(max_length=200)

class AdminBulkMarksUploadSerializer(serializers.Serializer):
    marks = AdminMarksUpdateSerializer(many=True)

from .models import GalleryItem

class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = ['id', 'title', 'media_file', 'is_video', 'order']
