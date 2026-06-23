from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.db.models import Sum, Count

from .models import TierForm, FormField, Student, Submission
from .serializers import (
    TierFormSerializer, 
    AdminTierFormSerializer,
    StudentSerializer, 
    SubmissionCreateSerializer, 
    SubmissionListSerializer
)
from .permissions import IsAdminOrSecretToken

# Public view set for active forms
class TierFormViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TierForm.objects.filter(is_active=True).order_by('order')
    serializer_class = TierFormSerializer

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Returns the first active TierForm (e.g., 'School Level')"""
        form = self.queryset.first()
        if form:
            serializer = self.get_serializer(form)
            return Response(serializer.data)
        return Response({"detail": "No active forms found."}, status=status.HTTP_404_NOT_FOUND)

# Public form submission endpoint
class SubmitFormView(APIView):
    def post(self, request):
        serializer = SubmissionCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "message": "Submission received successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Admin submission viewset
class SubmissionViewSet(viewsets.ModelViewSet):
    """Admin endpoint to manage registrations"""
    permission_classes = [IsAdminOrSecretToken]
    queryset = Submission.objects.all().order_by('-submitted_at')
    serializer_class = SubmissionListSerializer

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
    queryset = Student.objects.all().order_by('-created_at')
    serializer_class = StudentSerializer

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
        total_submissions = Submission.objects.count()
        total_paid_submissions = Submission.objects.filter(payment_status='PAID').count()
        total_pending_submissions = Submission.objects.filter(payment_status='PENDING').count()
        total_students = Student.objects.count()
        
        # Calculate revenue (entry_fee is stored on TierForm)
        revenue_data = Submission.objects.filter(payment_status='PAID').aggregate(
            total=Sum('form__entry_fee')
        )
        total_revenue = float(revenue_data['total'] or 0.0)

        # Tier distributions
        tier_distribution = []
        tiers = TierForm.objects.all()
        for tier in tiers:
            count = Submission.objects.filter(form=tier).count()
            tier_distribution.append({
                "id": tier.id,
                "name": tier.name,
                "count": count
            })

        # Recent activities (latest 5 submissions)
        recent_submissions = Submission.objects.all().order_by('-submitted_at')[:5]
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
