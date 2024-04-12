from typing import Any
from rest_framework import serializers
from api.tags.models import Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "label")
        read_only_fields = ("id",)
        extra_kwargs = {"label": {"required": True}}

    # Field-level validation
    #
    # Serializer is implicitly converting "label" field's value to string, and
    # that's why we'll have value as string in the validate_label method.
    def validate_label(self, value: str) -> str:
        value = value.strip()
        if len(value) > 100:
            raise serializers.ValidationError("Label is too long")
        if len(value) < 3:
            raise serializers.ValidationError("Label is too short")
        return value.lower()

    def create(self, validated_data: dict) -> Tag:
        # tag = Tag.objects.create(**validated_data)
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

    def update(self, instance: Tag, validated_data: dict) -> Tag:
        instance.label = validated_data.get("label", instance.label)
        instance.save()
        return instance
