from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from api.users.models import User

# =======================================
# Create user form in the admin page
# =======================================


class UserAdminCreationForm(forms.ModelForm):
    email = forms.EmailField(
        label="Email Address",
        widget=forms.EmailInput(
            attrs={"class": "form-control", "placeholder": "Enter email address"}
        ),
        max_length=255,
        required=True,
    )

    first_name = forms.CharField(
        label="First Name",
        widget=forms.TextInput(
            attrs={"class": "form-control", "placeholder": "Enter first name"}
        ),
        max_length=30,
        required=True,
    )

    last_name = forms.CharField(
        label="Last Name",
        widget=forms.TextInput(
            attrs={"class": "form-control", "placeholder": "Enter last name"}
        ),
        max_length=30,
        required=True,
    )

    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(
            attrs={"class": "form-control", "placeholder": "Enter password"}
        ),
        required=True,
    )

    confirm_password = forms.CharField(
        label="Confirm Password",
        widget=forms.PasswordInput(
            attrs={"class": "form-control", "placeholder": "Confirm password"}
        ),
        required=True,
    )

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name"]

    def clean_confirm_password(self) -> str:
        # password and confirm password are required

        pwd: str = self.cleaned_data["password"]
        confirm_pwd: str = self.cleaned_data["confirm_password"]

        if pwd != confirm_pwd:
            raise forms.ValidationError("Passwords do not match.")

        return confirm_pwd

    # Override the save method to hash the password
    def save(self, commit=True) -> User:
        user = super(UserAdminCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


# =======================================
# Update user form in the admin page
# =======================================


class UserAdminChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
        ]

    def clean_password(self) -> str:
        return self.initial["password"]
