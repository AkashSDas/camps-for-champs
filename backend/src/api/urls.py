from django.urls import path, include

urlpatterns = [
    path("users/", include("api.users.urls")),
    path("tags/", include("api.tags.urls")),
    path("features/", include("api.features.urls")),
    path("camps/", include("api.camps.urls")),
]
