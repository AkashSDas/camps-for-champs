from rest_framework import serializers
from src.api.orders.models import Order
from datetime import datetime


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating an order."""

    check_in = serializers.DateField()
    check_out = serializers.DateField()
    adult_guests_count = serializers.IntegerField()
    child_guests_count = serializers.IntegerField()
    pets_count = serializers.IntegerField()

    def validate_check_in(self, value: datetime) -> datetime:
        """Validate the check_in field."""

        if value < datetime.now().date():
            raise serializers.ValidationError(
                "Check in date must be greater than today"
            )
        return value

    def validate_check_out(self, value: datetime) -> datetime:
        """Validate the check_out field."""

        if value < datetime.now().date():
            raise serializers.ValidationError(
                "Check out date must be greater than today"
            )
        return value

    def validate_adult_guests_count(self, value: int) -> int:
        """Validate the adult_guests_count field."""

        if value < 0:
            raise serializers.ValidationError(
                "Adult guests count must be greater than or equal to 0"
            )
        return value

    def validate(self, attrs):
        """Validate check in and out timings."""

        check_in = attrs["check_in"]
        check_out = attrs["check_out"]

        if check_in >= check_out:
            raise serializers.ValidationError(
                "Check out date must be greater than check in date"
            )

        if check_in == check_out:
            raise serializers.ValidationError(
                "Check in and check out dates cannot be same"
            )

        return attrs
