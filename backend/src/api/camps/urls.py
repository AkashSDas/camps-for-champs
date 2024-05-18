from django.urls import path
from api.camps.views import (
    CampCreateListAPIView,
    CampRetriveUpdateDestroyAPIView,
    CampFeatureListCreateAPIView,
    CampFeatureRetrieveUpdateDestroyAPIView,
    CampImageViewSet,
    search_camps_view,
    like_camp_view,
    get_user_liked_camps,
)

urlpatterns = [
    path("search/", search_camps_view, name="search-camps"),
    path("", CampCreateListAPIView.as_view(), name="camps"),
    path("<int:pk>/", CampRetriveUpdateDestroyAPIView.as_view(), name="camp"),
    path("<int:pk>/likes/", like_camp_view, name="like-camp"),
    path("likes/user/", get_user_liked_camps, name="user-liked-camps"),
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
