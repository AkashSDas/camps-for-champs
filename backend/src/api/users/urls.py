from django.urls import path, include
from api.users.views import signup_view, logout_view, LoginView, refresh_view


# Password reset urls (django_rest_passwordreset)
# - `forgot-password/` -- This needs USERNAME_FIELD (here email) for whom you want to change the password
# - `forgot-password/confirm/` -- This will ask for the password reset token and new password.


urlpatterns = [
    path("signup/", signup_view, name="signup"),
    path("login/", LoginView.as_view(), name="access-token"),
    path("login/refresh/", refresh_view, name="refresh-token"),
    path("logout/", logout_view, name="logout"),
    path(
        "forgot-password/",
        include("django_rest_passwordreset.urls", namespace="forgot-password"),
    ),
]
