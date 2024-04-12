from django.urls import path
from .views import get_tag, get_tags, create_tag, update_tag, delete_tag

urlpatterns = [
    path("", get_tags, name="get_tags"),
    path("<int:tag_id>/", get_tag, name="get_tag"),
    path("create/", create_tag, name="create_tag"),
    path("<int:tag_id>/update/", update_tag, name="update_tag"),
    path("<int:tag_id>/delete/", delete_tag, name="delete_tag"),
]
