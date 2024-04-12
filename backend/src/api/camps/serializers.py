from typing import cast
from rest_framework import serializers
from api.camps.models import Camp
from datetime import timedelta, datetime, time


Time = type[time]


def validate_checkin_and_checkout_time(check_in: Time, check_out: Time) -> None:
    check_in_dt = datetime.combine(datetime.today(), check_in)  # type: ignore
    check_out_dt = datetime.combine(datetime.today(), check_out)  # type: ignore

    if check_in_dt >= check_out_dt:
        raise serializers.ValidationError(
            "Check in time must be less than check out time."
        )
    if check_out_dt - check_in_dt < timedelta(hours=4):
        raise serializers.ValidationError(
            "Duration of stay must be greater than 4 hours."
        )


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
        if self.instance is None:
            # Create

            check_in_at = cast(type[time], attrs["check_in_at"])
            check_out_at = cast(type[time], attrs["check_out_at"])
            validate_checkin_and_checkout_time(check_in_at, check_out_at)
        else:
            # Update

            check_in_at = attrs.get("check_in_at")
            check_out_at = attrs.get("check_out_at")

            if check_in_at and check_out_at:
                check_in_at = cast(type[time], check_in_at)
                check_out_at = cast(type[time], check_out_at)
                validate_checkin_and_checkout_time(check_in_at, check_out_at)
            elif check_in_at:
                check_in_at = cast(type[time], check_in_at)
                validate_checkin_and_checkout_time(
                    check_in_at, self.instance.check_out_at
                )
            elif check_out_at:
                check_out_at = cast(type[time], check_out_at)
                validate_checkin_and_checkout_time(
                    self.instance.check_in_at, check_out_at
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
