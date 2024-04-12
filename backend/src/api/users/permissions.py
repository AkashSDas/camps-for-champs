from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from api.users.models import UserRole


class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to only allow users with ADMIN role to perform write
    actions, and allow read-only access for non-admin users.
    """

    def has_permission(self, req: Request, view):
        if req.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return req.user.role == UserRole.ADMIN.value

    def has_object_permission(self, req: Request, view, obj):
        if req.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return req.user.role == UserRole.ADMIN.value
