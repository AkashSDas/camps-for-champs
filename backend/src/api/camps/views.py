from datetime import date, timedelta
from typing import Any, cast
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
    ListCreateAPIView,
)
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_204_NO_CONTENT,
    HTTP_200_OK,
    HTTP_201_CREATED,
)
from api.camps.models import Camp, CampFeature
from api.camps.serializers import (
    CampImageSerializer,
    CampSerarchResultSerialiazer,
    CampSerializer,
    CampFeatureSerializer,
    CampImageUploadSerializer,
    CampSearchSerializer,
)
from api.users.permissions import IsAdminOrReadOnly
from django.db.models import F, Q, Sum, Avg, Count
from django.db.models.functions import Coalesce
from rest_framework.pagination import PageNumberPagination

# ========================================
# Camp views
# ========================================


# Multiple views are inherited in this class to keep the URL route same
# else will have to create separate URL routes for each view
class CampCreateListAPIView(CreateAPIView, ListAPIView):
    # permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    permission_classes_by_action = {
        "list": [],
        "create": [IsAuthenticated, IsAdminOrReadOnly],
    }
    queryset = Camp.objects.all()
    serializer_class = CampSerializer

    def get_object(self):
        return super().get_object()

    def perform_create(self, serializer: CampSerializer) -> None:
        serializer.save(created_by=self.request.user)

    def create(self, req: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=req.data)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(
                {
                    "message": "Camp created successfully.",
                    "camp": serializer.data,
                },
                status=HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def list(self, req: Request, *args, **kwargs) -> Response:
        limit = cast(int, req.query_params.get("limit", 10))
        paginator = PageNumberPagination()
        paginator.page_size = limit
        queryset = self.get_queryset()
        queryset = queryset.order_by("-per_night_cost")
        result_page = paginator.paginate_queryset(queryset, req)
        serializer = CampSerarchResultSerialiazer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class CampRetriveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    permission_classes_by_action = {
        "retrieve": [],
        "update": [IsAuthenticated, IsAdminOrReadOnly],
        "partial_update": [IsAuthenticated, IsAdminOrReadOnly],
        "destroy": [IsAuthenticated, IsAdminOrReadOnly],
    }
    queryset = Camp.objects.all()
    serializer_class = CampSerializer

    def get_object(self):
        return super().get_object()

    def perform_update(self, serializer: CampSerializer) -> None:
        serializer.save(updated_by=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            self.perform_update(serializer)
            return Response(
                {
                    "message": "Camp updated successfully.",
                    "camp": serializer.data,
                },
                status=HTTP_200_OK,
            )
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def update(self, req: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=req.data)
        if serializer.is_valid(raise_exception=True):
            self.perform_update(serializer)
            return Response(
                {
                    "message": "Camp updated successfully.",
                    "camp": serializer.data,
                },
                status=HTTP_200_OK,
            )
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def destroy(self, req: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Camp deleted successfully."}, status=HTTP_204_NO_CONTENT
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # serializer = self.get_serializer(instance)
        serializer = CampSerarchResultSerialiazer(instance)
        return Response(serializer.data)


# ========================================
# Camp feature views
# ========================================


class CampFeatureListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    queryset = CampFeature.objects.all()
    serializer_class = CampFeatureSerializer


class CampFeatureRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    queryset = CampFeature.objects.all()
    serializer_class = CampFeatureSerializer


# ========================================
# Camp image views
# ========================================


class CampImageViewSet(viewsets.ViewSet):
    permission_classes_by_action = {
        "list": [],
        "create": [IsAuthenticated, IsAdminOrReadOnly],
    }

    def list(self, req: Request, pk: int, *args, **kwargs) -> Response:
        camp = Camp.objects.filter(id=pk).first()
        if not camp:
            return Response(
                {"message": "Camp not found with the given id."},
                status=HTTP_400_BAD_REQUEST,
            )

        images = cast(Any, camp).images.all().order_by("-created_at")
        serializer = CampImageSerializer(images, many=True)

        return Response(
            {
                "images": serializer.data,
                "camp": {
                    "id": camp.pk,
                    "name": camp.name,
                },
            },
            status=HTTP_200_OK,
        )

    def create(self, req: Request, pk: int, *args, **kwargs) -> Response:
        camp = Camp.objects.filter(id=pk).first()
        if not camp:
            return Response(
                {"message": "Camp not found with the given id."},
                status=HTTP_400_BAD_REQUEST,
            )

        image = cast(dict, req.data).get("image")
        alt_text = cast(dict, req.data).get("alt_text")
        if not image:
            return Response(
                {"message": "Image is required."},
                status=HTTP_400_BAD_REQUEST,
            )

        serializer = CampImageUploadSerializer(
            data={"camp": camp.pk, "image": image, "alt_text": alt_text}
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()

            return Response(
                {
                    "message": "Image uploaded successfully.",
                    "image": serializer.data,
                },
                status=HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


# ========================================
# Search camp views
# ========================================


@api_view(["POST"])
def search_camps_view(req: Request) -> Response:
    serializer = CampSearchSerializer(data=req.data)
    if serializer.is_valid(raise_exception=True):
        data = cast(dict, serializer.validated_data)
        queryset = Camp.objects.all()

        location = data.get("location")  # [72.775662, 18.979543, 72.978723, 19.273803,]
        if isinstance(location, list) and len(location) == 4:
            queryset = queryset.filter(
                latitude__range=[location[1], location[3]],
                longitude__range=[location[0], location[2]],
            )

        total_guests = 0
        total_guests = total_guests + data.get("adult_guests_count", 0)
        total_guests = total_guests + data.get("child_guests_count", 0)
        total_guests = total_guests + round(data.get("pets_count", 0) / 2)

        check_in = data.get("check_in_date", date.today() + timedelta(days=1))
        check_out = data.get("check_out_date", check_in + timedelta(days=1))

        # get total occupancy count during check in and check out period

        queryset = (
            queryset.annotate(
                occupied_count=Coalesce(
                    Sum(
                        "occupancies__adult_guests_count",
                        filter=(
                            (
                                Q(occupancies__check_out__gte=check_in)
                                & Q(occupancies__check_in__lte=check_in)
                            )
                            | (
                                Q(occupancies__check_in__lte=check_out)
                                & Q(occupancies__check_out__gte=check_out)
                            )
                            | (
                                Q(occupancies__check_in__lte=check_in)
                                & Q(occupancies__check_out__gte=check_out)
                            )
                            | (
                                Q(occupancies__check_in__gte=check_in)
                                & Q(occupancies__check_out__lte=check_out)
                            )
                        ),
                    )
                    + Sum(
                        "occupancies__child_guests_count",
                        filter=(
                            (
                                Q(occupancies__check_out__gte=check_in)
                                & Q(occupancies__check_in__lte=check_in)
                            )
                            | (
                                Q(occupancies__check_in__lte=check_out)
                                & Q(occupancies__check_out__gte=check_out)
                            )
                            | (
                                Q(occupancies__check_in__lte=check_in)
                                & Q(occupancies__check_out__gte=check_out)
                            )
                            | (
                                Q(occupancies__check_in__gte=check_in)
                                & Q(occupancies__check_out__lte=check_out)
                            )
                        ),
                    )
                    + Sum(
                        "occupancies__pets_count",
                        filter=(
                            (
                                Q(occupancies__check_out__gte=check_in)
                                & Q(occupancies__check_in__lte=check_in)
                            )
                            | (
                                Q(occupancies__check_in__lte=check_out)
                                & Q(occupancies__check_out__gte=check_out)
                            )
                            | (
                                Q(occupancies__check_in__lte=check_in)
                                & Q(occupancies__check_out__gte=check_out)
                            )
                            | (
                                Q(occupancies__check_in__gte=check_in)
                                & Q(occupancies__check_out__lte=check_out)
                            )
                        ),
                    )
                    / 2,
                    0,
                ),
            ).filter(
                Q(occupancy_count__gte=F("occupied_count") + total_guests),
            )
            # .annotate(
            #     average_rating=Coalesce(Avg("reviews__rating"), 0.0),
            # )
            .order_by("-per_night_cost")
        )

        paginator = PageNumberPagination()
        paginator.page_size = cast(int, req.query_params.get("limit", 10))
        paginated_queryset = paginator.paginate_queryset(queryset, req)

        return paginator.get_paginated_response(
            {"camps": CampSerarchResultSerialiazer(paginated_queryset, many=True).data}
        )

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
