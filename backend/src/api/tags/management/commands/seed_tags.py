from typing import Literal
from django.core.management.base import BaseCommand
from api.tags.models import Tag

# python manage.py seed_tags --mode=refresh
Mode = Literal["refresh", "clear"]
"""
Mode of the seed command:
- refresh: Clear all data and creates new ones
- clear: Clear all data and do not create any object
"""

dummy_data = [
    # cost
    "Budget-Friendly",
    "Affordable",
    "Economical",
    "Value",
    "Discount",
    "Bargain",
    "Cost-effective",
    "Wallet-friendly",
    "Thrifty",
    "Low-Cost ",
    # nature
    "Scenic Beauty",
    "Natural Wonders",
    "Wilderness",
    "Breathtaking Views",
    "Flora & Fauna",
    "Eco-friendly",
    "Greenery",
    "Untouched Wilderness",
    "Wildlife Sanctuary",
    "Nature's Tranquility",
    # benefits
    "Relaxation",
    "Stress Relief",
    "Health Benefits",
    "Wellness",
    "Rejuvenation",
    "Serenity",
    "Peacefulness",
    "Outdoor Therapy",
    "Mental Clarity",
    "Refreshment",
]
"""Dummy data for seeding tags."""


class Command(BaseCommand):
    help = "Seed tags data"

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--mode", type=str, help="Mode of the seed command: refresh / clear"
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write("[seed:tag]: START")
        mode = options["mode"]

        match mode:
            case "clear":
                Tag.objects.all().delete()
                self.stdout.write(self.style.SUCCESS("Tag data cleared successfully."))
            case "refresh":
                for label in dummy_data:
                    Tag.objects.create(label=label)
                self.stdout.write(self.style.SUCCESS("Tag data seeded successfully."))
            case _:
                self.stdout.write(
                    self.style.ERROR("Invalid mode. Use either `refresh` or `clear`.")
                )
