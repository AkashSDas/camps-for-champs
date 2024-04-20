from typing import cast
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from api.users.serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    CustomTokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from api.users.models import User
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_205_RESET_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_200_OK,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from deprecated import deprecated


def get_tokens_for_user(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(cast(RefreshToken, refresh).access_token),
    }


@api_view(["POST"])
def signup_view(req: Request, *args, **kwargs) -> Response:
    serializer = UserSerializer(data=req.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    tokens = get_tokens_for_user(cast(User, user))

    return Response(
        {
            "message": "Successfully signed up",
            "user": UserSerializer(user).data,
            **tokens,
        },
        status=HTTP_201_CREATED,
    )


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        res = super().post(request, *args, **kwargs)
        if isinstance(res.data, dict) and res.status_code == HTTP_200_OK:
            refresh_token = res.data.pop("refresh", None)
            if refresh_token:
                res.set_cookie(
                    key="refresh",
                    value=refresh_token,
                    httponly=True,
                    secure=True,
                    samesite="None",
                )
                return res

        return res


@deprecated(reason="Use refresh_view instead", version="1.0", action="error")
class RefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

    def post(self, req: Request, *args, **kwargs) -> Response:
        res = super().post(req, *args, **kwargs)
        if isinstance(res.data, dict) and res.status_code == HTTP_200_OK:
            refresh_token = res.data.pop("refresh", None)
            if refresh_token:
                res.set_cookie(
                    key="refresh",
                    value=refresh_token,
                    httponly=True,
                    secure=True,
                    samesite="None",
                )
                return res

        return res


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def refresh_view(req: Request, *args, **kwargs) -> Response:
    refresh_token = req.COOKIES.get("refresh")
    if not refresh_token:
        return Response({"error": "Unauthorized"}, status=HTTP_401_UNAUTHORIZED)

    try:
        new_refresh_token = RefreshToken(refresh_token)
        res = Response(
            {
                "access": str(new_refresh_token.access_token),
                "user": UserSerializer(req.user).data,
            },
            status=HTTP_200_OK,
        )

        res.set_cookie(
            key="refresh",
            value=str(new_refresh_token),
            httponly=True,
            secure=True,
            samesite="None",
        )

        return res
    except TokenError:
        return Response(
            {"error": "Invalid or expired token"}, status=HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(req: Request, *args, **kwargs) -> Response:
    try:
        refresh_token = req.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"error": "Unauthorized"}, status=HTTP_401_UNAUTHORIZED)
        print(refresh_token)

        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful"}, status=HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)
