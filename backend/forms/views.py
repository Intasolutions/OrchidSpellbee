from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import TierForm
from .serializers import TierFormSerializer, SubmissionCreateSerializer

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

class SubmitFormView(APIView):
    def post(self, request):
        serializer = SubmissionCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "message": "Submission received successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .models import Submission
from .serializers import SubmissionListSerializer

class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin endpoint to fetch all registrations"""
    queryset = Submission.objects.all().order_by('-submitted_at')
    serializer_class = SubmissionListSerializer

from django.contrib.auth import authenticate

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
