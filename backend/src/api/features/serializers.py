from rest_framework import serializers
from api.features.models import Feature


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ("id", "feature_type", "label", "description")
        read_only_fields = ("id",)

    def validate(self, attrs):
        if "label" in attrs:
            attrs["label"] = attrs["label"].lower()
        return attrs
