from rest_framework import serializers
from api.camps.models import Camp


class CampSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camp
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "created_by",
        )
