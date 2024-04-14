from django.urls import path
from .views import (
    camp_reviews_list_create,
    camp_review_retrieve_update_delete,
    change_public_status_of_camp_review,
)


urlpatterns = [
    path(
        "camps/<int:camp_id>/reviews/",
        camp_reviews_list_create,
        name="camp_reviews_list_create",
    ),
    path(
        "camps/<int:camp_id>/reviews/<int:review_id>/",
        camp_review_retrieve_update_delete,
        name="camp_review_retrieve_update_delete",
    ),
    path(
        "camps/<int:camp_id>/reviews/<int:review_id>/change-public-status/",
        change_public_status_of_camp_review,
        name="change_public_status_of_camp_review",
    ),
]
