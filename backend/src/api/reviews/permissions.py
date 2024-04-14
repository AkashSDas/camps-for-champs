from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from .models import Review


class IsReviewOwner(BasePermission):
    def has_object_permission(self, req: Request, view: None, obj: Review) -> bool:
        author = obj.author
        if author is None:
            return False
        return author.pk == req.user.pk
