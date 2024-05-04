from typing import Optional
from rest_framework import serializers
from api.reviews.models import Review


class GetReviewSerializer(serializers.ModelSerializer):
    """Serializer for getting a review."""

    author = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            "id",
            "author",
            "camp",
            "rating",
            "created_at",
            "comment",
            "helpful_count",
        )

    def get_author(self, obj: Review) -> Optional[dict]:
        """Get the author of the review and populate the author field."""

        author = obj.author
        if author is None:
            return None

        return {
            "id": author.pk,
            "fullname": author.full_name,
        }


class CreateReviewSerializer(serializers.ModelSerializer):
    """Serializer for creating a review."""

    class Meta:
        model = Review
        fields = ("rating", "comment")

    def save(self, **kwargs):
        return super().save(**kwargs)

    def validate_rating(self, value: int) -> int:
        """Validate the rating field."""

        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value


class ChangePublicStatusReviewSerializer(serializers.Serializer):
    """Serializer for changing the public status of a review."""

    is_public = serializers.BooleanField()

    def save(self, review: Review):
        review.is_public = self.validated_data["is_public"]  # type: ignore
        review.save()
        return review
