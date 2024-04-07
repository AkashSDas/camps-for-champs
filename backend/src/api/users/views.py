from typing import cast
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from api.users.serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from api.users.models import User
from rest_framework.status import HTTP_201_CREATED


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
