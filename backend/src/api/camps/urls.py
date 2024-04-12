from django.urls import path
from api.camps.views import CampCreateListAPIView, CampRetriveUpdateDestroyAPIView

urlpatterns = [
    path("", CampCreateListAPIView.as_view(), name="camps"),
    path("<int:pk>/", CampRetriveUpdateDestroyAPIView.as_view(), name="camp"),
]
