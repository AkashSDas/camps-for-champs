from typing import cast
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token
from api.users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "password")
        read_only_fields = ("id", "is_admin", "is_active", "is_staff")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data: dict) -> User:
        pwd = validated_data.pop("password")
        instance = self.Meta.model(**validated_data)
        if pwd is not None:
            instance.set_password(pwd)
        else:
            raise serializers.ValidationError("Password is required")

        instance.save()
        return instance

    def update(self, instance: User, validated_data: dict) -> User:
        for attr, value in validated_data.items():
            if attr == "password":
                instance.set_password(value)
            else:
                setattr(instance, attr, value)

        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                "The new password and confirm password do not match"
            )
        return data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User) -> Token:
        token = super().get_token(user)
        # Save custom fields to token
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = cast(dict, super().validate(attrs))
        # Serialize and include the user data in the response
        user = UserSerializer(self.user).data
        if not isinstance(user, dict):
            raise serializers.ValidationError("User isn't valid")
        data["user"] = user
        return data
