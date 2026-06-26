from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TierFormViewSet, 
    SubmitFormView, 
    SubmissionViewSet, 
    AdminTierFormViewSet,
    AdminStudentViewSet,
    AdminDashboardStatsView,
    AdminLoginView,
    StudentRegisterView,
    StudentLoginView,
    StudentMeView,
    StudentGoogleAuthView
)

router = DefaultRouter()
# Public endpoints
router.register(r'forms', TierFormViewSet, basename='forms')

# Admin endpoints
router.register(r'admin/forms', AdminTierFormViewSet, basename='admin-forms')
router.register(r'admin/students', AdminStudentViewSet, basename='admin-students')
router.register(r'submissions', SubmissionViewSet, basename='submissions')

urlpatterns = [
    path('', include(router.urls)),
    path('submit/', SubmitFormView.as_view(), name='submit-form'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin-stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('auth/register/', StudentRegisterView.as_view(), name='student-register'),
    path('auth/login/', StudentLoginView.as_view(), name='student-login'),
    path('auth/google/', StudentGoogleAuthView.as_view(), name='student-google-auth'),
    path('auth/me/', StudentMeView.as_view(), name='student-me'),
]
