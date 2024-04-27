from dataclasses import fields
from typing import Any, cast
from rest_framework import serializers
from api.camps.models import Camp, CampFeature, CampImage, CampImageManager
from api.features.models import Feature
from datetime import timedelta, datetime, time
from api.tags.serializers import TagSerializer
from api.tags.models import Tag
from api.features.serializers import FeatureSerializer
from api.reviews.serializers import GetReviewSerializer


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
            "image",
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


class CampImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampImage
        fields = ("camp", "image", "alt_text")


# {
#     "adultGuestsCount": 3,
#     "childGuestsCount": 2,
#     "petsCount": 1,
#     "location": {
#         "name": "Mumbai Cushion",
#         "mapbox_id": "dXJuOm1ieHBvaTpiZTZjOTI5My03YTAwLTQxNTktYjQ5MS1jMjMwOWNjMWNmMzc",
#         "feature_type": "poi",
#         "address": "Sr No 239/4",
#         "full_address": "Sr No 239/4, Mulshi, 411057, India",
#         "place_formatted": "Mulshi, 411057, India",
#         "context": {
#             "country": {
#                 "name": "India",
#                 "country_code": "IN",
#                 "country_code_alpha_3": "IND"
#             },
#             "postcode": {
#                 "id": "dXJuOm1ieHBsYzpBdVVPYXc",
#                 "name": "411057"
#             },
#             "place": {
#                 "id": "dXJuOm1ieHBsYzpBY0FJYXc",
#                 "name": "Mulshi"
#             },
#             "neighborhood": {
#                 "id": "dXJuOm1ieHBsYzpBOFdzYXc",
#                 "name": "Hinjewadi Rajiv Gandhi Infotech Park"
#             },
#             "address": {
#                 "name": "Sr No 239/4",
#                 "address_number": "no 239/4",
#                 "street_name": "sr"
#             },
#             "street": {
#                 "name": "sr"
#             }
#         },
#         "language": "en",
#         "maki": "marker",
#         "poi_category": [
#             "services",
#             "self storage"
#         ],
#         "poi_category_ids": [
#             "services",
#             "storage"
#         ],
#         "external_ids": {
#             "foursquare": "d363b26faf704d0dde80ae6e"
#         },
#         "metadata": {}
#     },
#     "checkInDate": "2024-04-29T18:30:00.000Z",
#     "checkOutDate": "2024-04-29T18:30:00.000Z"
# }


# create serailizer with above search input. these are optional fields
class CampSearchSerializer(serializers.Serializer):
    adultGuestsCount = serializers.IntegerField(required=False, min_value=1)
    childGuestsCount = serializers.IntegerField(required=False, min_value=1)
    petsCount = serializers.IntegerField(required=False, min_value=1)
    # location -> [72.775662, 18.979543, 72.978723, 19.273803,]
    location = serializers.ListField(
        child=serializers.FloatField(), required=False, min_length=4, max_length=4
    )
    checkInDate = serializers.DateTimeField(required=False)
    checkOutDate = serializers.DateTimeField(required=False)

    def validate(self, attrs):
        if "checkInDate" in attrs and "checkOutDate" in attrs:
            check_in_date = attrs["checkInDate"]
            check_out_date = attrs["checkOutDate"]
            if check_in_date > check_out_date:
                raise serializers.ValidationError(
                    "Check in date must be less than check out date."
                )

        if "location" in attrs:
            location = attrs["location"]
            if location[0] > location[2] or location[1] > location[3]:
                raise serializers.ValidationError("Invalid location coordinates.")

        return attrs


class CampSerarchResultSerialiazer(CampSerializer):
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Camp
        fields = CampSerializer.Meta.fields + (
            "reviews",
            "average_rating",
        )

    def get_reviews(self, instance: Camp):
        reviews = cast(Any, instance).reviews.all()
        return GetReviewSerializer(reviews, many=True).data

    def get_average_rating(self, obj):
        avg_rating = obj.average_rating()
        avg_rating = avg_rating if avg_rating else 0
        return round(avg_rating, 2)
