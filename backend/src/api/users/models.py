from enum import Enum, unique
from typing import Optional
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from os import getenv
from django.core.mail import EmailMultiAlternatives


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
    profile_pic = models.ImageField(upload_to="images/users/", null=True, blank=True)
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
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True


# https://pypi.org/project/django-rest-passwordreset/
@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """

    print(f"Reset Password Token")
    print(f"Key: {reset_password_token.key}")
    print(f"User: {reset_password_token.user}")
    print(f"Created: {reset_password_token.created_at}")
    print(f"Instance: {instance}")
    print(f"Sender: {sender}")
    # Reset Password Token
    # Key: a1427e817d9d034facadf8db3c1
    # User: User(example@gmail.com)
    # Created: 2024-04-07 08:15:42.997243+00:00
    # Instance: <django_rest_passwordreset.views.ResetPasswordRequestToken object at 0x102e13010>
    # Sender: <class 'django_rest_passwordreset.views.ResetPasswordRequestToken'>

    # context = {
    #     "current_user": reset_password_token.user,
    #     "first_name": reset_password_token.user.first_name,
    #     "last_name": reset_password_token.user.last_name,
    #     "email": reset_password_token.user.email,
    #     "reset_password_url": f"{reverse('forgot-password:reset-password-request')}?token={reset_password_token.key}",
    #     "token": reset_password_token.key,
    # }
    frontend_pwd_reset_url = getenv("FRONTEND_PASSWORD_RESET_URL")

    email_html_message = f"""
    <p>Hello {reset_password_token.user.first_name},</p>
    <p>You requested a password reset for your account.</p>
    <p>Please click on the following link to reset your password:</p>
    <p><a href="{frontend_pwd_reset_url}?token={reset_password_token.key}">Reset Password</a></p>
    """

    msg = EmailMultiAlternatives(
        "Password Reset Request",
        email_html_message,
        "noreply@somehost.local",
        [reset_password_token.user.email],
    )

    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
