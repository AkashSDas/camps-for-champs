from typing import Literal
from django.core.management.base import BaseCommand
from api.camps.models import Camp
from api.tags.models import Tag
from api.users.models import User

# python manage.py seed_camps --mode=refresh
Mode = Literal["refresh", "clear"]
"""
Mode of the seed command:
- refresh: Clear all data and creates new ones
- clear: Clear all data and do not create any object
"""

dummy_data = [
    {
        "name": "Riverside Retreat",
        "about": "Experience the tranquility of camping by the river.",
        "check_in_at": "15:00:00",
        "check_out_at": "11:00:00",
        "occupancy_count": 4,
        "per_night_cost": 50.00,
        "is_active": True,
        "latitude": 45.6789,
        "longitude": -121.2345,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
    {
        "name": "Mountain View Campground",
        "about": "Enjoy stunning views of the mountains at this campsite.",
        "check_in_at": "14:00:00",
        "check_out_at": "12:00:00",
        "occupancy_count": 6,
        "per_night_cost": 70.00,
        "is_active": True,
        "latitude": 36.7890,
        "longitude": -112.3456,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
]
"""Dummy data for seeding camps."""


class Command(BaseCommand):
    help = "Seed camps data"

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--mode", type=str, help="Mode of the seed command: refresh / clear"
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write("[seed:camp]: START")
        mode = options["mode"]

        match mode:
            case "clear":
                Camp.objects.all().delete()
                self.stdout.write(
                    self.style.SUCCESS("Camp features cleared successfully.")
                )
            case "refresh":
                Camp.objects.all().delete()
                for data in dummy_data:
                    camp = Camp.objects.create(**data)
                    tags = Tag.objects.all().order_by("?")[:5]
                    camp.tags.set(tags)
                self.stdout.write(
                    self.style.SUCCESS("Camp features data seeded successfully.")
                )
            case _:
                self.stdout.write(
                    self.style.ERROR("Invalid mode. Use either `refresh` or `clear`.")
                )
