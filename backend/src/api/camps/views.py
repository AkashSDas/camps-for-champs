from rest_framework.generics import CreateAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_400_BAD_REQUEST
from api.camps.models import Camp
from api.camps.serializers import CampSerializer
from api.users.permissions import IsAdminOrReadOnly


class CampCreateAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
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
                {"message": "Camp created successfully.", "camp": serializer.data},
                status=201,
            )
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
