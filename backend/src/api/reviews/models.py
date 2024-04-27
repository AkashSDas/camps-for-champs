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


class CampRelatedReviewQueryset(models.QuerySet):
    def avg_rating(self, camp_id: int):
        return self.filter(camp_id=camp_id).aggregate(models.Avg("rating"))

    def camp_top_rating(self, camp_id: int):
        return self.filter(camp_id=camp_id).order_by("-rating", "-helpful_count")

    def top_rated_camps(self):
        return (
            self.values("camp")
            .annotate(
                avg_rating=models.Avg("rating"),
                total_reviews=models.Count("id"),
            )
            .order_by("-avg_rating", "-total_reviews")
        )


class ReviewQuerySet(models.QuerySet):
    def public(self):
        return self.filter(is_public=True)

    def helpful(self):
        return self.filter(helpful_count__gte=1)

    def reported(self):
        return self.filter(report_review_count__gte=1)


class AuthorReviewManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()

    def author_reviews(self, author_id: int):
        return self.get_queryset().filter(author_id=author_id).order_by("-created_at")


class ReviewManager(models.Manager):
    def get_queryset(self):
        return ReviewQuerySet(self.model, using=self._db)

    def public(self):
        return self.get_queryset().public()

    def helpful(self):
        return self.get_queryset().helpful()

    def reported(self):
        return self.get_queryset().reported()


class Review(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="reviews")
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

    objects = ReviewManager()
    camps = CampRelatedReviewQueryset.as_manager()
    authors = AuthorReviewManager()
