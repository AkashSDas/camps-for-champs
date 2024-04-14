from enum import Enum, unique
from django.db import models
from api.users.models import User
from api.camps.models import Camp


@unique
class Rating(Enum):
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5


class Review(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    camp = models.ForeignKey(Camp, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(tag.value, tag.name) for tag in Rating])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    comment = models.TextField(null=False, blank=True, max_length=500)
    helpful_count = models.IntegerField(default=0)
    report_review_count = models.IntegerField(default=0)
    is_public = models.BooleanField(default=True)

    class Meta:
        db_table = "reviews"
        ordering = ["-created_at"]
        unique_together = ["author", "camp"]  # author can only review a camp once
