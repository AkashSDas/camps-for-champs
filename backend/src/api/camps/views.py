from tabnanny import check
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_204_NO_CONTENT,
    HTTP_200_OK,
    HTTP_201_CREATED,
)
from api.camps.models import Camp
from api.camps.serializers import CampSerializer
from api.users.permissions import IsAdminOrReadOnly


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
        return super().list(req, *args, **kwargs)


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
