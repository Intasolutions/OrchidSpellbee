from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.db.models import Sum, Count, Q
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth.models import User
from django.conf import settings
import razorpay

from .models import TierForm, FormField, Student, Submission
from .serializers import (
    TierFormSerializer, 
    AdminTierFormSerializer,
    StudentSerializer, 
    SubmissionCreateSerializer, 
    SubmissionListSerializer,
    StudentRegisterSerializer
)
from .permissions import IsAdminOrSecretToken

# Public view set for active forms
class TierFormViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TierForm.objects.filter(is_active=True).order_by('order')
    serializer_class = TierFormSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Returns the appropriate active TierForm based on student progress"""
        tiers = list(self.queryset.order_by('order'))
        if not tiers:
            return Response({"detail": "No active forms found."}, status=status.HTTP_404_NOT_FOUND)
            
        if not request.user.is_authenticated or not hasattr(request.user, 'student_profile'):
            return Response(self.get_serializer(tiers[0]).data)
            
        student = request.user.student_profile
        submissions = Submission.objects.filter(student=student).select_related('form').order_by('-form__order')
        
        if not submissions.exists():
            return Response(self.get_serializer(tiers[0]).data)
            
        latest = submissions.first()
        if not latest.is_passed:
            return Response({"detail": "You must pass the current level exam to proceed.", "status": "awaiting_or_failed"}, status=status.HTTP_400_BAD_REQUEST)
            
        next_tier = None
        for tier in tiers:
            if tier.order > latest.form.order:
                next_tier = tier
                break
                
        if next_tier:
            return Response(self.get_serializer(next_tier).data)
            
        return Response({"detail": "You have completed all available levels!", "status": "completed"}, status=status.HTTP_400_BAD_REQUEST)

# Public form submission endpoint
class SubmitFormView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubmissionCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            submission = serializer.save()
            
            response_data = {
                "status": "success",
                "message": "Submission received successfully!",
                "submission_id": submission.id
            }
            
            # Check if tier has an entry fee
            if submission.form.entry_fee > 0:
                try:
                    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                    amount_in_paise = int(submission.form.entry_fee * 100)
                    
                    order_data = {
                        "amount": amount_in_paise,
                        "currency": "INR",
                        "receipt": f"receipt_{submission.id}"
                    }
                    
                    razorpay_order = client.order.create(data=order_data)
                    submission.razorpay_order_id = razorpay_order['id']
                    submission.save()
                    
                    response_data['razorpay_order_id'] = razorpay_order['id']
                    response_data['amount'] = amount_in_paise
                    response_data['key_id'] = settings.RAZORPAY_KEY_ID
                    
                except Exception as e:
                    return Response({"error": f"Failed to create Razorpay order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            return Response({"error": "Missing payment parameters"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            submission = Submission.objects.get(razorpay_order_id=razorpay_order_id, student=request.user.student_profile)
        except Submission.DoesNotExist:
            return Response({"error": "Invalid order id or unauthorized"}, status=status.HTTP_404_NOT_FOUND)
            
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            
            # Signature matches
            submission.razorpay_payment_id = razorpay_payment_id
            submission.razorpay_signature = razorpay_signature
            submission.payment_status = 'PAID'
            submission.save()
            
            return Response({"status": "success", "message": "Payment verified successfully!"})
            
        except razorpay.errors.SignatureVerificationError:
            return Response({"error": "Signature verification failed"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin submission viewset
class SubmissionViewSet(viewsets.ModelViewSet):
    """Admin endpoint to manage registrations"""
    permission_classes = [IsAdminOrSecretToken]
    queryset = Submission.objects.filter(student__is_deleted=False).order_by('-submitted_at')
    serializer_class = SubmissionListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student_id')
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs

    @action(detail=True, methods=['patch'])
    def update_marks(self, request, pk=None):
        submission = self.get_object()
        marks = request.data.get('marks')
        if marks is not None:
            submission.marks = float(marks)
            submission.save()
            return Response({"status": "success", "is_passed": submission.is_passed})
        return Response({"error": "Marks not provided"}, status=status.HTTP_400_BAD_REQUEST)

# Admin TierForm (Levels) viewset
class AdminTierFormViewSet(viewsets.ModelViewSet):
    """Admin CRUD endpoint for TierForms"""
    permission_classes = [IsAdminOrSecretToken]
    queryset = TierForm.objects.all().order_by('order')
    serializer_class = AdminTierFormSerializer

# Admin Student viewset
class AdminStudentViewSet(viewsets.ModelViewSet):
    """Admin CRUD endpoint for Students"""
    permission_classes = [IsAdminOrSecretToken]
    serializer_class = StudentSerializer

    def get_queryset(self):
        # For list requests, differentiate between active and trash lists
        if self.action == 'list':
            trash = self.request.query_params.get('trash', 'false').lower() == 'true'
            if trash:
                return Student.objects.filter(is_deleted=True).order_by('-deleted_at')
            return Student.objects.filter(is_deleted=False).order_by('-created_at')
        
        # For detail views (retrieve, update, destroy, custom actions), search all
        return Student.objects.all()

    def destroy(self, request, *args, **kwargs):
        student = self.get_object()
        if student.is_deleted:
            # Permanent hard delete from trash
            student.delete()
            return Response({"status": "success", "message": "Student permanently deleted."})
        else:
            # Soft delete (move to trash)
            student.is_deleted = True
            from django.utils import timezone
            student.deleted_at = timezone.now()
            student.save()
            return Response({"status": "success", "message": "Student profile moved to trash."})

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        student = self.get_object()
        if not student.is_deleted:
            return Response({"error": "Student is already active"}, status=status.HTTP_400_BAD_REQUEST)
        student.is_deleted = False
        student.deleted_at = None
        student.save()
        return Response({"status": "success", "message": "Student profile restored successfully!"})

    @action(detail=True, methods=['post'])
    def promote(self, request, pk=None):
        student = self.get_object()
        tier_id = request.data.get('tier_id')
        if not tier_id:
            return Response({"error": "tier_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tier = TierForm.objects.get(id=tier_id)
        except TierForm.DoesNotExist:
            return Response({"error": "Invalid tier_id"}, status=status.HTTP_404_NOT_FOUND)
        
        student.current_tier = tier
        student.save()
        return Response({"status": "success", "message": f"Student promoted to {tier.name}!"})

# Admin Dashboard Stats View
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminOrSecretToken]

    def get(self, request):
        total_submissions = Submission.objects.filter(student__is_deleted=False).count()
        total_paid_submissions = Submission.objects.filter(
            Q(student__is_deleted=False) & 
            (Q(payment_status='PAID') | Q(form__entry_fee__lte=0))
        ).count()
        total_pending_submissions = Submission.objects.filter(
            student__is_deleted=False, 
            payment_status='PENDING', 
            form__entry_fee__gt=0
        ).count()
        total_students = Student.objects.filter(is_deleted=False).count()
        
        # Calculate revenue (entry_fee is stored on TierForm)
        revenue_data = Submission.objects.filter(student__is_deleted=False, payment_status='PAID').aggregate(
            total=Sum('form__entry_fee')
        )
        total_revenue = float(revenue_data['total'] or 0.0)

        # Tier distributions
        tier_distribution = []
        tiers = TierForm.objects.all()
        for tier in tiers:
            count = Submission.objects.filter(student__is_deleted=False, form=tier).count()
            tier_distribution.append({
                "id": tier.id,
                "name": tier.name,
                "count": count
            })

        # Recent activities (latest 5 submissions)
        recent_submissions = Submission.objects.filter(student__is_deleted=False).order_by('-submitted_at')[:5]
        recent_activity = []
        for sub in recent_submissions:
            recent_activity.append({
                "id": sub.id,
                "student_name": sub.student.name,
                "student_email": sub.student.email,
                "form_name": sub.form.name,
                "submitted_at": sub.submitted_at
            })

        return Response({
            "total_submissions": total_submissions,
            "total_paid_submissions": total_paid_submissions,
            "total_pending_submissions": total_pending_submissions,
            "total_students": total_students,
            "total_revenue": total_revenue,
            "tier_distribution": tier_distribution,
            "recent_activity": recent_activity
        })


# Admin login endpoint
class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_staff or user.is_superuser:
                return Response({"success": True, "message": "Authenticated successfully."})
            else:
                return Response({"success": False, "error": "User does not have admin permissions."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"success": False, "error": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)


class StudentRegisterView(APIView):
    def post(self, request):
        serializer = StudentRegisterSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            token, _ = Token.objects.get_or_create(user=student.user)
            return Response({"token": token.key, "student_id": student.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password)
        if user is not None and hasattr(user, 'student_profile'):
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "student_id": user.student_profile.id})
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

class StudentGoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client_id = settings.GOOGLE_CLIENT_ID
            
            try:
                # Verify the token using Google's public keys
                idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
            except ValueError as e:
                # For example, if client_id doesn't match the token's audience (aud)
                return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_401_UNAUTHORIZED)

            email = idinfo['email']
            name = idinfo.get('name', 'Google User')

            user, created = User.objects.get_or_create(
                username=email,
                defaults={'email': email}
            )
            
            if created:
                user.set_unusable_password()
                user.save()

            student, _ = Student.objects.get_or_create(
                user=user,
                email=email,
                defaults={'name': name}
            )

            auth_token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "token": auth_token.key, 
                "student_id": student.id,
                "is_new": created
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentMeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        student = getattr(request.user, 'student_profile', None)
        if not student:
            return Response({"error": "Not a student"}, status=status.HTTP_403_FORBIDDEN)
            
        latest_sub = Submission.objects.filter(student=student).order_by('-form__order').first()
        
        status_data = {
            "name": student.name,
            "email": student.email,
            "has_submission": False,
            "latest_tier": None,
            "marks": None,
            "is_passed": None,
        }
        
        if latest_sub:
            status_data["has_submission"] = True
            status_data["latest_tier"] = latest_sub.form.name
            status_data["marks"] = latest_sub.marks
            status_data["is_passed"] = latest_sub.is_passed
            
        return Response(status_data)
