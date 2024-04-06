from enum import Enum, unique
from typing import Optional
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


@unique
class UserRole(Enum):
    """
    Enum representing the roles of users in the system.
    """

    ADMIN = "admin"
    STAFF = "staff"
    CUSTOMER = "customer"


class UserManager(BaseUserManager):
    """
    Custom manager for the User model.
    """

    def create_user(
        self,
        email: str,
        first_name: str,
        last_name: str,
        role: str,
        password: Optional[str] = None,
        is_active=True,
        is_staff=False,
        is_admin=False,
    ) -> "User":
        if not isinstance(password, str):
            raise ValueError("Invalid password")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")

        # Create user
        user: User = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            role=role,
            is_active=is_active,
            is_staff=is_staff,
            is_admin=is_admin,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staff(
        self,
        email: str,
        first_name: str,
        last_name: str,
        password: Optional[str] = None,
    ) -> "User":
        return self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=UserRole.STAFF.value,
            password=password,
            is_staff=True,
        )

    def create_superuser(
        self,
        email: str,
        first_name: str,
        last_name: str,
        password: Optional[str] = None,
    ) -> "User":
        return self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=UserRole.ADMIN.value,
            password=password,
            is_staff=True,
            is_admin=True,
        )


class User(AbstractBaseUser, PermissionsMixin):
    """
    Represents a user in the system.
    """

    # Fields

    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(
        max_length=20, choices=[(role.value, role.value) for role in UserRole]
    )
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def __str__(self) -> str:
        return f"User({self.email})"

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
