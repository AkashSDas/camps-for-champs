from typing import Literal
from django.http import QueryDict
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from api.reviews.models import Review
from api.reviews.serializers import GetReviewSerializer, CreateReviewSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.serializers import ValidationError
from rest_framework.status import (
    HTTP_404_NOT_FOUND,
    HTTP_405_METHOD_NOT_ALLOWED,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
)
from contextlib import suppress
from api.camps.models import Camp
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

Param = Literal["limit", "offset", "camp"]


class ParamException(Exception):
    def __init__(self, message: str, param: Param):
        self.message = message
        self.param = param


def parse_query_params(params: QueryDict) -> dict:
    limit = params.get("limit", "2")

    try:
        with suppress(ValueError):
            limit = int(limit)

        if type(limit) != int:
            raise ParamException("Limit must be an integer", "limit")
        if limit < 1 or limit > 100:
            raise ParamException("Limit must be between 1 and 100", "limit")

        return {"limit": limit}
    except ParamException as e:
        raise ValidationError({e.param: e.message}) from e
    except Exception as e:
        raise ValidationError({"message": "Invalid query parameter"}) from e


@api_view(["GET", "POST"])
def camp_reviews_list_create(req: Request, camp_id: int, *args, **kwargs) -> Response:
    exists = Camp.objects.filter(pk=camp_id).exists()
    if not exists:
        return Response({"message": "Camp not found"}, status=HTTP_404_NOT_FOUND)

    if req.method == "GET":
        params = parse_query_params(req.query_params)
        reviews = Review.objects.filter(camp=camp_id).order_by("-created_at")
        paginator = PageNumberPagination()
        paginator.page_size = params["limit"]
        result_page = paginator.paginate_queryset(reviews, req)
        serializer = GetReviewSerializer(result_page, many=True)
        return paginator.get_paginated_response({"reviews": serializer.data})
    elif req.method == "POST":
        if not IsAuthenticated().has_permission(req, None):
            raise PermissionDenied()

        serializer = CreateReviewSerializer(data=req.data)
        if serializer.is_valid():
            exists = Review.objects.filter(camp=camp_id, author=req.user).exists()
            if exists:
                return Response(
                    {"message": "You have already reviewed this camp"},
                    status=HTTP_400_BAD_REQUEST,
                )

            camp = Camp.objects.get(pk=camp_id)
            serializer.save(camp=camp, author=req.user)
            return Response(
                {
                    "message": "Review created successfully",
                    "review": serializer.data,
                },
                status=HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    return Response(
        {"message": "Method not allowed"}, status=HTTP_405_METHOD_NOT_ALLOWED
    )
