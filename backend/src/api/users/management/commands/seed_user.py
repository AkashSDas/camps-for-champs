from typing import Literal, cast
from django.core.management.base import BaseCommand
from api.users.models import User, UserRole, UserManager

# python manage.py seed_tags --mode=refresh
Mode = Literal["refresh", "clear"]
"""
Mode of the seed command:
- refresh: Clear all data and creates new ones
- clear: Clear all data and do not create any object
"""

dummy_data = [
    {
        "email": "james@gmail.com",
        "first_name": "James",
        "last_name": "Bond",
        "role": UserRole.ADMIN.value,
        "password": "password123",
        "is_admin": True,
    },
    {
        "email": "ron@gmail.com",
        "first_name": "Ron",
        "last_name": "Weasley",
        "role": UserRole.STAFF.value,
        "password": "password123",
        "is_staff": True,
    },
    {
        "email": "bane@gmail.com",
        "first_name": "Bane",
        "last_name": "Smith",
        "role": UserRole.STAFF.value,
        "password": "password123",
        "is_staff": True,
    },
    {
        "email": "john@gmail.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": UserRole.CUSTOMER.value,
        "password": "password123",
    },
    {
        "email": "tyrion@gmail.com",
        "first_name": "Tyrion",
        "last_name": "Lannister",
        "role": UserRole.CUSTOMER.value,
        "password": "password123",
    },
    {
        "email": "paul@gmail.com",
        "first_name": "Paul",
        "last_name": "Walker",
        "role": UserRole.CUSTOMER.value,
        "password": "password123",
    },
    {
        "email": "ronny@gmail.com",
        "first_name": "Ronny",
        "last_name": "Doe",
        "role": UserRole.CUSTOMER.value,
        "password": "password123",
    },
    {
        "email": "johanna@gmail.com",
        "first_name": "Johanna",
        "last_name": "Erickson",
        "role": UserRole.CUSTOMER.value,
        "password": "password123",
    },
]
"""Dummy data for seeding users."""


class Command(BaseCommand):
    help = "Seed user data"

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--mode", type=str, help="Mode of the seed command: refresh / clear"
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write("[seed:user]: START")
        mode = options["mode"]

        match mode:
            case "clear":
                User.objects.exclude(email="akash@gmail.com").delete()
                self.stdout.write(self.style.SUCCESS("User data cleared successfully."))
            case "refresh":
                User.objects.exclude(email="akash@gmail.com").delete()
                for data in dummy_data:
                    cast(UserManager, User.objects).create_user(**data)
                self.stdout.write(self.style.SUCCESS("User data seeded successfully."))
            case _:
                self.stdout.write(
                    self.style.ERROR("Invalid mode. Use either `refresh` or `clear`.")
                )
