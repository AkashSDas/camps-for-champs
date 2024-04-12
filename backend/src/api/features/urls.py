from django.urls import path
from api.features.views import FeatureViewSet

urlpatterns = [
    path("", FeatureViewSet.as_view({"get": "list", "post": "create"})),
    path(
        "<int:pk>/",
        FeatureViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
    ),
]
