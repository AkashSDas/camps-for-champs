from django.urls import path
from .views import camp_reviews_list_create


urlpatterns = [
    path(
        "camps/<int:camp_id>/reviews/",
        camp_reviews_list_create,
        name="camp_reviews_list_create",
    )
]
