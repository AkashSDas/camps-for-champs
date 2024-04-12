from django.urls import path, include

urlpatterns = [
    path("users/", include("api.users.urls")),
    path("camps/", include("api.camps.urls")),
    path("tags/", include("api.tags.urls")),
]
