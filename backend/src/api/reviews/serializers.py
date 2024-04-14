from typing import Optional
from rest_framework import serializers
from api.reviews.models import Review


class GetReviewSerializer(serializers.ModelSerializer):
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
        author = obj.author
        if author is None:
            return None

        return {
            "id": author.pk,
            "fullname": author.full_name,
        }
