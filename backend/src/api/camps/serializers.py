from rest_framework import serializers
from api.camps.models import Camp


class CampSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camp
        # fields = "__all__"
        fields = (
            "id",
            "name",
            "about",
            "check_in_at",
            "check_out_at",
            "occupancy_count",
            "per_night_cost",
            "is_active",
            "tags",
            "created_at",
            "updated_at",
            "created_by",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "created_by",
        )

    def validate(self, attrs):
        if attrs["check_in_at"] >= attrs["check_out_at"]:
            raise serializers.ValidationError(
                "Check-in time must be before check-out time."
            )
        # attrs["created_by"] = self.context["request"].user
        return attrs

    def validate_per_night_cost(self, value: float) -> float:
        if value < 1000:
            raise serializers.ValidationError(
                "Per night cost must be greater than 2000.",
            )
        if value > 1_00_000:
            raise serializers.ValidationError(
                "Per night cost must be less than 100000."
            )
        return value

    def validate_occupancy_count(self, value: int) -> int:
        if value < 10:
            raise serializers.ValidationError(
                "Occupancy count must be greater than 10."
            )
        return value
