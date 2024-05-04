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
    {
        "name": "Lakeside Camping",
        "about": "Camp by the lake and enjoy the serene views.",
        "check_in_at": "13:00:00",
        "check_out_at": "10:00:00",
        "occupancy_count": 5,
        "per_night_cost": 60.00,
        "is_active": True,
        "latitude": 34.5678,
        "longitude": -123.4567,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
    {
        "name": "Forest Hideaway",
        "about": "Escape into the woods and reconnect with nature.",
        "check_in_at": "16:00:00",
        "check_out_at": "09:00:00",
        "occupancy_count": 3,
        "per_night_cost": 40.00,
        "is_active": True,
        "latitude": 23.4567,
        "longitude": -134.5678,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
    {
        "name": "Sunset Valley Camp",
        "about": "Witness the breathtaking sunset from this campsite.",
        "check_in_at": "18:00:00",
        "check_out_at": "08:00:00",
        "occupancy_count": 2,
        "per_night_cost": 30.00,
        "is_active": True,
        "latitude": 12.3456,
        "longitude": -145.6789,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
    {
        "name": "Beachside Camping",
        "about": "Camp by the beach and enjoy the sound of the waves.",
        "check_in_at": "17:00:00",
        "check_out_at": "07:00:00",
        "occupancy_count": 4,
        "per_night_cost": 45.00,
        "is_active": True,
        "latitude": 56.7890,
        "longitude": -156.7890,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
    {
        "name": "Desert Oasis Camp",
        "about": "Experience camping in the middle of the desert.",
        "check_in_at": "19:00:00",
        "check_out_at": "06:00:00",
        "occupancy_count": 3,
        "per_night_cost": 35.00,
        "is_active": True,
        "latitude": 67.8901,
        "longitude": -167.8901,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
    {
        "name": "Winter Wonderland Camp",
        "about": "Enjoy camping in the snow-covered landscapes.",
        "check_in_at": "20:00:00",
        "check_out_at": "05:00:00",
        "occupancy_count": 2,
        "per_night_cost": 25.00,
        "is_active": True,
        "latitude": 78.9012,
        "longitude": -178.9012,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
    {
        "name": "Tropical Paradise Camp",
        "about": "Camp in the tropical rainforests and enjoy the lush greenery.",
        "check_in_at": "21:00:00",
        "check_out_at": "04:00:00",
        "occupancy_count": 5,
        "per_night_cost": 55.00,
        "is_active": True,
        "latitude": 89.0123,
        "longitude": -179.0123,
        "created_by": User.objects.filter(is_admin=True).order_by("?")[0],
    },
    {
        "name": "Safari Adventure Camp",
        "about": "Experience camping in the wild and spot exotic animals.",
        "check_in_at": "22:00:00",
        "check_out_at": "03:00:00",
        "occupancy_count": 6,
        "per_night_cost": 65.00,
        "is_active": True,
        "latitude": 90.1234,
        "longitude": -180.1234,
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
