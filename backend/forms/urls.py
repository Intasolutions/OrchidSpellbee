from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TierFormViewSet, 
    SubmitFormView, 
    SubmissionViewSet, 
    AdminTierFormViewSet,
    AdminStudentViewSet,
    AdminAgentViewSet,
    AdminSchoolViewSet,
    AdminDashboardStatsView,
    AdminLoginView,
    StudentRegisterView,
    StudentLoginView,
    StudentMeView,
    StudentGoogleAuthView,
    VerifyPaymentView,
    SiteSettingsView,
    AdminSiteSettingsView,
    AdminRegistrationCreateView,
    AdminBulkRegistrationView,
    AdminBackfillSchoolsView,
    AdminBulkMarksUploadView
)

router = DefaultRouter()
# Public endpoints
router.register(r'forms', TierFormViewSet, basename='forms')

# Admin endpoints
router.register(r'admin/forms', AdminTierFormViewSet, basename='admin-forms')
router.register(r'admin/students', AdminStudentViewSet, basename='admin-students')
router.register(r'admin/agents', AdminAgentViewSet, basename='admin-agents')
router.register(r'admin/schools', AdminSchoolViewSet, basename='admin-schools')
router.register(r'submissions', SubmissionViewSet, basename='submissions')

urlpatterns = [
    path('', include(router.urls)),
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('admin/settings/', AdminSiteSettingsView.as_view(), name='admin-settings'),
    path('admin/registrations/add/', AdminRegistrationCreateView.as_view(), name='admin-registrations-add'),
    path('admin/registrations/bulk-add/', AdminBulkRegistrationView.as_view(), name='admin-registrations-bulk-add'),
    path('admin/registrations/bulk-marks/', AdminBulkMarksUploadView.as_view(), name='admin-registrations-bulk-marks'),
    path('submit/', SubmitFormView.as_view(), name='submit-form'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin-stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('auth/register/', StudentRegisterView.as_view(), name='student-register'),
    path('auth/login/', StudentLoginView.as_view(), name='student-login'),
    path('auth/google/', StudentGoogleAuthView.as_view(), name='student-google-auth'),
    path('auth/me/', StudentMeView.as_view(), name='student-me'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('admin/backfill-schools/', AdminBackfillSchoolsView.as_view(), name='admin-backfill-schools'),
]
