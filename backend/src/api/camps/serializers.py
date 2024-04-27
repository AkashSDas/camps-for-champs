from typing import cast
from rest_framework import serializers
from api.camps.models import Camp, CampFeature, CampImage, CampImageManager
from api.features.models import Feature
from datetime import timedelta, datetime, time
from api.tags.serializers import TagSerializer
from api.tags.models import Tag
from api.features.serializers import FeatureSerializer


Time = type[time]


class SimpleCampSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camp
        fields = ("id", "name")


class CampFeatureSerializer(serializers.ModelSerializer):
    # camp = serializers.PrimaryKeyRelatedField(read_only=True)
    # feature = serializers.PrimaryKeyRelatedField(read_only=True)

    # this results in recursion due to cyclic dependency since CampSerializer also uses it
    # camp = CampSerializer(read_only=True)
    camp = SimpleCampSerializer(read_only=True)
    feature = FeatureSerializer(read_only=True)

    # We've to add these new fields to the serializer to accept the data
    # because camp and feature are read_only fields
    camp_id = serializers.PrimaryKeyRelatedField(
        queryset=Camp.objects.all(), source="camp", write_only=True
    )
    feature_id = serializers.PrimaryKeyRelatedField(
        queryset=Feature.objects.all(), source="feature", write_only=True
    )

    class Meta:
        model = CampFeature
        fields = ("id", "camp", "feature", "is_available", "camp_id", "feature_id")
        read_only_fields = ("id", "created_at", "updated_at", "camp", "feature")

    def create(self, validated_data: dict) -> CampFeature:
        camp = validated_data["camp"]
        feature = validated_data["feature"]
        exists = CampFeature.objects.filter(camp=camp, feature=feature).exists()
        if exists:
            raise serializers.ValidationError(
                "This feature is already available for this camp.",
                code="feature_already_available",
            )
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

    def update(self, instance: CampFeature, validated_data: dict) -> CampFeature:
        # don't update camp and feature (since we don't want to change camp and feature
        # we'll better delete and create a new one, because we don't want multiple
        # camp-feature pairs with the same camp and feature)
        instance.is_available = validated_data.get(
            "is_available", instance.is_available
        )
        instance.save()
        return instance


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


class CampImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampImage
        fields = (
            "id",
            "camp",
            "image_url",
            "provider_id",
            "alt_text",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class CampSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all())
    features = CampFeatureSerializer(many=True, read_only=True)
    images = serializers.SerializerMethodField()

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
            "features",
            "images",
        )
        read_only_fields = ("id", "created_at", "updated_at", "created_by", "images")

    def get_images(self, instance: Camp):
        images = cast(CampImageManager, CampImage.objects).camp_preview_images(limit=10)
        return CampImageSerializer(images, many=True).data

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

    def to_representation(self, instance: Camp) -> dict:
        representation = super().to_representation(instance)
        representation["tags"] = TagSerializer(instance.tags.all(), many=True).data
        return representation
