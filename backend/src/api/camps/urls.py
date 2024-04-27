from django.urls import path
from api.camps.views import (
    CampCreateListAPIView,
    CampRetriveUpdateDestroyAPIView,
    CampFeatureListCreateAPIView,
    CampFeatureRetrieveUpdateDestroyAPIView,
    CampImageViewSet,
)

urlpatterns = [
    path("", CampCreateListAPIView.as_view(), name="camps"),
    path("<int:pk>/", CampRetriveUpdateDestroyAPIView.as_view(), name="camp"),
    path("features/", CampFeatureListCreateAPIView.as_view(), name="camp-features"),
    path(
        "features/<int:pk>/",
        CampFeatureRetrieveUpdateDestroyAPIView.as_view(),
        name="camp-feature",
    ),
    path(
        "<int:pk>/images/",
        CampImageViewSet.as_view({"post": "create", "get": "list"}),
        name="camp-images",
    ),
]
