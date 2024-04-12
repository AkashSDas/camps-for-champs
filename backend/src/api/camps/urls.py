from django.urls import path
from api.camps.views import CampCreateAPIView

urlpatterns = [
    path("", CampCreateAPIView.as_view(), name="camp-create"),
]
