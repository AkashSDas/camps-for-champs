from rest_framework.viewsets import ModelViewSet
from api.features.models import Feature
from api.features.serializers import FeatureSerializer
from rest_framework.permissions import IsAuthenticated
from api.users.permissions import IsAdminOrReadOnly


class FeatureViewSet(ModelViewSet):
    """
    General camp features CRUD viewset. `list` and `retrieve` actions are public, but
    all other actions are restricted to authenticated users with admin permissions.
    """

    queryset = Feature.objects.all().order_by("feature_type", "label")
    serializer_class = FeatureSerializer
    permission_classes_by_action = {
        "list": [],
        "retrieve": [],
        "create": [IsAuthenticated, IsAdminOrReadOnly],
        "update": [IsAuthenticated, IsAdminOrReadOnly],
        "partial_update": [IsAuthenticated, IsAdminOrReadOnly],
        "destroy": [IsAuthenticated, IsAdminOrReadOnly],
    }
    permission_classes = []

    # Handle permissions
    def get_permissions(self) -> list:
        if self.action in self.permission_classes_by_action:
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        return [permission() for permission in self.permission_classes]
