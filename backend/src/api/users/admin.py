from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from api.users.forms import UserAdminChangeForm, UserAdminCreationForm

User = get_user_model()


# =============================================================
# Customize the interface of User model in the Admin Page
# =============================================================


class UserAdmin(BaseUserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    list_display = ["email", "first_name", "last_name", "is_admin", "is_active"]
    list_filter = ["email", "is_admin"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {"fields": ("first_name", "last_name", "stripe_customer_id")},
        ),
        ("Permissions", {"fields": ("is_admin", "is_active", "is_staff")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password",
                    "confirm_password",
                ),
            },
        ),
    )

    search_fields = ["email"]
    ordering = ["-created_at"]
    filter_horizontal = ()


# Registering User model and its interface in admin page
admin.site.register(User, UserAdmin)
