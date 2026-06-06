from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TierFormViewSet, SubmitFormView, SubmissionViewSet, AdminLoginView

router = DefaultRouter()
router.register(r'forms', TierFormViewSet, basename='forms')
router.register(r'submissions', SubmissionViewSet, basename='submissions')

urlpatterns = [
    path('', include(router.urls)),
    path('submit/', SubmitFormView.as_view(), name='submit-form'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
]
