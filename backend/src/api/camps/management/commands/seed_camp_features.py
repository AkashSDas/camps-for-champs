from typing import Literal
from django.core.management.base import BaseCommand
from api.camps.models import Camp, CampFeature
from api.features.models import Feature

# python manage.py seed_camp_features --mode=refresh
Mode = Literal["refresh", "clear"]
"""
Mode of the seed command:
- refresh: Clear all data and creates new ones
- clear: Clear all data and do not create any object
"""


class Command(BaseCommand):
    help = "Seed camp features data"

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--mode", type=str, help="Mode of the seed command: refresh / clear"
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write("[seed:camp:features]: START")
        mode = options["mode"]

        match mode:
            case "clear":
                CampFeature.objects.all().delete()
                self.stdout.write(
                    self.style.SUCCESS("Camp features data cleared successfully.")
                )
            case "refresh":
                CampFeature.objects.all().delete()
                camps = Camp.objects.all()
                # features = Feature.objects.all().order_by("?")[:5]
                highlights = Feature.objects.filter(feature_type="highlight").order_by(
                    "?"
                )[:3]
                surroundings = Feature.objects.filter(
                    feature_type="surrounding"
                ).order_by("?")[:5]
                activities = Feature.objects.filter(feature_type="activity").order_by(
                    "?"
                )[:5]
                amenities = Feature.objects.filter(feature_type="amenity").order_by(
                    "?"
                )[:5]

                for camp in camps:
                    for feature in [
                        *highlights,
                        *surroundings,
                        *activities,
                        *amenities,
                    ]:
                        CampFeature.objects.create(
                            camp=camp, feature=feature, is_available=True
                        )

                self.stdout.write(
                    self.style.SUCCESS("Camp features data seeded successfully.")
                )
            case _:
                self.stdout.write(
                    self.style.ERROR("Invalid mode. Use either `refresh` or `clear`.")
                )
