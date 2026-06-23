from rest_framework import permissions
import os

class IsAdminOrSecretToken(permissions.BasePermission):
    def has_permission(self, request, view):
        # 1. Allow standard authenticated Django admin/staff users
        if request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
            return True
            
        # 2. Allow server-to-server calls via secret token (from Next.js proxy)
        token = request.headers.get('X-Admin-Token')
        secret = os.environ.get('ADMIN_API_SECRET', 'dev-secret-key-123')
        
        if token and token == secret:
            return True
            
        return False
