from django.urls import path
from api.users.views import signup_view, logout_view, LoginView, RefreshView


urlpatterns = [
    path("signup/", signup_view, name="signup"),
    path("login/", LoginView.as_view(), name="access-token"),
    path("login/refresh/", RefreshView.as_view(), name="refresh-token"),
    path("logout/", logout_view, name="logout"),
]
