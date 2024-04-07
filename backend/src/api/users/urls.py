from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.users.views import signup_view, logout_view


urlpatterns = [
    path("signup/", signup_view, name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="access-token"),
    path("login/refresh/", TokenRefreshView.as_view(), name="refresh-token"),
    path("logout/", logout_view, name="logout"),
]
