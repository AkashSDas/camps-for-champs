from django.urls import path, include

urlpatterns = [
    path("users/", include("api.users.urls")),
    path("tags/", include("api.tags.urls")),
    path("features/", include("api.features.urls")),
    path("camps/", include("api.camps.urls")),
    path("orders/", include("api.orders.urls")),
    path("payments/", include("api.payments.urls")),
    path("", include("api.reviews.urls")),
]
