from enum import Enum, unique
from django.db import models
from api.users.models import User
from api.camps.models import Camp


@unique
class Rating(Enum):
    """Enum for camp rating values."""

    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5


# =================================
# Camp related review queryset
# =================================


class CampRelatedReviewQueryset(models.QuerySet):
    """Queryset for camp related reviews."""

    def avg_rating(self, camp_id: int):
        """Get average rating of the camp."""
        return self.filter(camp_id=camp_id).aggregate(models.Avg("rating"))

    def camp_top_rating(self, camp_id: int):
        """Get top rated reviews for the camp."""
        return self.filter(camp_id=camp_id).order_by("-rating", "-helpful_count")

    def top_rated_camps(self):
        """Get top rated camps."""
        return (
            self.values("camp")
            .annotate(
                avg_rating=models.Avg("rating"),
                total_reviews=models.Count("id"),
            )
            .order_by("-avg_rating", "-total_reviews")
        )


# =================================
# Review queryset
# =================================


class ReviewQuerySet(models.QuerySet):
    """Queryset for overall reviews."""

    def public(self):
        """Get public reviews."""
        return self.filter(is_public=True)

    def helpful(self):
        """Get helpful reviews."""
        return self.filter(helpful_count__gte=1)

    def reported(self):
        """Get reported reviews."""
        return self.filter(report_review_count__gte=1)


class ReviewManager(models.Manager):
    """Manager for reviews."""

    def get_queryset(self):
        return ReviewQuerySet(self.model, using=self._db)

    def public(self):
        return self.get_queryset().public()

    def helpful(self):
        return self.get_queryset().helpful()

    def reported(self):
        return self.get_queryset().reported()


# =================================
# Author review manager
# =================================


class AuthorReviewManager(models.Manager):
    """Manager for author reviews."""

    def get_queryset(self):
        return super().get_queryset()

    def author_reviews(self, author_id: int):
        """Get reviews by author."""
        return self.get_queryset().filter(author_id=author_id).order_by("-created_at")


# =================================
# Review model
# =================================


class Review(models.Model):
    """
    Model for storing camp reviews by users. Reviews are in terms of ratings and comment.
    Also, users can mark reviews as helpful or report them.
    """

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
