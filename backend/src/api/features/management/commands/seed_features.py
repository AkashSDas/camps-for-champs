# https://stackoverflow.com/questions/51577441/how-to-seed-django-project-insert-a-bunch-of-data-into-the-project-for-initi

from typing import Literal
from django.core.management.base import BaseCommand
from api.features.models import Feature, FeatureType

# python manage.py seed_features --mode=refresh
Mode = Literal["refresh", "clear"]
"""
Mode of the seed command:
- refresh: Clear all data and creates new ones
- clear: Clear all data and do not create any object
"""

dummy_data = {
    FeatureType.HIGHLIGHT: [
        {
            "label": "Family Friendly",
            "description": "A campsite suitable for families.",
        },
        {
            "label": "Pet Friendly",
            "description": "A campsite that welcomes pets.",
        },
        {
            "label": "Beach Access",
            "description": "A campsite with direct access to the beach.",
        },
        {
            "label": "RV Friendly",
            "description": "A campsite suitable for RVs.",
        },
    ],
    FeatureType.SURROUNDING: [
        {
            "label": "Mountain View",
            "description": "A campsite with scenic mountain views.",
        },
        {
            "label": "Lake View",
            "description": "A campsite overlooking a serene lake.",
        },
        {
            "label": "River View",
            "description": "A campsite with a view of a nearby river.",
        },
        {
            "label": "Forest View",
            "description": "A campsite surrounded by lush forests.",
        },
    ],
    FeatureType.ACTIVITY: [
        {
            "label": "Hiking Trails",
            "description": "Access to nearby hiking trails.",
        },
        {
            "label": "Biking Trails",
            "description": "Access to nearby biking trails.",
        },
        {
            "label": "Fishing Spots",
            "description": "Access to nearby fishing spots.",
        },
        {
            "label": "Swimming Spots",
            "description": "Access to nearby swimming spots.",
        },
    ],
    FeatureType.AMENITY: [
        {
            "label": "Fireplace",
            "description": "A fireplace to keep you warm.",
        },
        {
            "label": "Pet-friendly",
            "description": "Pets are allowed.",
        },
        {
            "label": "Wi-Fi",
            "description": "Free Wi-Fi available.",
        },
        {
            "label": "Kitchen",
            "description": "A kitchen for cooking.",
        },
        {
            "label": "Shower",
            "description": "Hot water shower available.",
        },
        {
            "label": "Parking",
            "description": "Parking available.",
        },
        {
            "label": "Electricity",
            "description": "Electricity available.",
        },
        {
            "label": "Toilet",
            "description": "Toilet available.",
        },
        {
            "label": "BBQ",
            "description": "BBQ available.",
        },
        {
            "label": "Swimming pool",
            "description": "Swimming pool available.",
        },
    ],
}
"""Dummy data for seeding features."""


class Command(BaseCommand):
    help = "Seed feature data for testing and development."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--mode", type=str, help="Mode of the seed command: refresh / clear"
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write("[seed:features]: START")
        mode = options["mode"]
        success_msg = ""

        match mode:
            case "clear":
                Feature.objects.all().delete()
                success_msg = "Cleared all feature data"
                self.stdout.write(self.style.SUCCESS(f"[seed:features]: {success_msg}"))
            case "refresh":
                Feature.objects.all().delete()
                for feature_type, data_list in dummy_data.items():
                    for data in data_list:
                        Feature.objects.create(
                            feature_type=feature_type.value,
                            label=data["label"],
                            description=data["description"],
                        )

                success_msg = "Refreshed feature data"
                self.stdout.write(self.style.SUCCESS(f"[seed:features]: {success_msg}"))
            case _:
                self.stdout.write(self.style.ERROR("[seed:features]: Invalid mode"))
