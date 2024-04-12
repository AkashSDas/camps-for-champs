from typing import Optional, cast
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from api.tags.serializers import TagSerializer
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.permissions import IsAuthenticated
from api.tags.models import Tag
from rest_framework.pagination import PageNumberPagination
from api.users.permissions import IsAdminOrReadOnly


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminOrReadOnly])
def create_tag(req: Request, *args, **kwargs) -> Response:
    serializer = TagSerializer(data=req.data)
    serializer.is_valid(raise_exception=True)
    exists = Tag.objects.filter(
        label=cast(dict, serializer.validated_data)["label"]
    ).exists()

    if exists:
        return Response(
            {"message": "Tag with this name already exists"},
            status=HTTP_400_BAD_REQUEST,
        )
    tag = serializer.save()

    return Response(
        {"message": "Tag created successfully", "tag": TagSerializer(tag).data},
        status=HTTP_201_CREATED,
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdminOrReadOnly])
def update_tag(req: Request, tag_id: int, *args, **kwargs) -> Response:
    tag: Optional[Tag] = None
    try:
        tag = Tag.objects.get(id=tag_id)
    except Tag.DoesNotExist:
        return Response({"message": "Tag not found"}, status=HTTP_404_NOT_FOUND)

    serializer = TagSerializer(tag, data=req.data, partial=True)
    serializer.is_valid(raise_exception=True)
    new_tag = serializer.save()

    return Response(
        {"message": "Tag updated successfully", "tag": TagSerializer(new_tag).data},
        status=HTTP_201_CREATED,
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminOrReadOnly])
def delete_tag(req: Request, tag_id: int, *args, **kwargs) -> Response:
    tag: Optional[Tag] = None
    try:
        tag = Tag.objects.get(id=tag_id)
    except Tag.DoesNotExist:
        return Response({"message": "Tag not found"}, status=HTTP_404_NOT_FOUND)

    tag.delete()
    return Response({"message": "Tag deleted successfully"}, status=HTTP_200_OK)


@api_view(["GET"])
def get_tag(req: Request, tag_id: int, *args, **kwargs) -> Response:
    tag: Optional[Tag] = None
    try:
        tag = Tag.objects.get(id=tag_id)
    except Tag.DoesNotExist:
        return Response({"message": "Tag not found"}, status=HTTP_404_NOT_FOUND)

    return Response({"tag": TagSerializer(tag).data}, status=HTTP_200_OK)


@api_view(["GET"])
def get_tags(req: Request, *args, **kwargs) -> Response:
    paginator = PageNumberPagination()
    paginator.page_size = 10
    tags = Tag.objects.all()
    result_page = paginator.paginate_queryset(tags, req)
    serializer = TagSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)
