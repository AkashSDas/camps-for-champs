from typing import Literal
from django.core.management.base import BaseCommand
from api.camps.models import Camp, CampFeature, CampImage
from api.features.models import Feature
from random import shuffle

# python manage.py seed_camp_images --mode=refresh
Mode = Literal["refresh", "clear"]
"""
Mode of the seed command:
- refresh: Clear all data and creates new ones
- clear: Clear all data and do not create any object
"""

images = [
    # "../../../../media/camp_images/img1.avif",
    # "../../../../media/camp_images/img2.avif",
    # "../../../../media/camp_images/img3.avif",
    # "../../../../media/camp_images/img4.avif",
    # "../../../../media/camp_images/img5.avif",
    # "../../../../media/camp_images/img6.avif",
    # "../../../../media/camp_images/img7.avif",
    "images/camps/unsplash_MwYBzsaSAGQ_r6qnqu.png",
    "images/camps/unsplash_MwYBzsaSAGQ_r6qnqu.png",
    "images/camps/unsplash_MwYBzsaSAGQ_r6qnqu.png",
    "images/camps/unsplash_MwYBzsaSAGQ_r6qnqu.png",
    "images/camps/unsplash_MwYBzsaSAGQ_r6qnqu.png",
    "images/camps/unsplash_MwYBzsaSAGQ_r6qnqu.png",
    "images/camps/unsplash_MwYBzsaSAGQ_r6qnqu.png",
    "images/camps/unsplash_MwYBzsaSAGQ_r6qnqu.png",
]


class Command(BaseCommand):
    help = "Seed camp images data"

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--mode", type=str, help="Mode of the seed command: refresh / clear"
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write("[seed:camp:images]: START")
        mode = options["mode"]

        match mode:
            case "clear":
                CampImage.objects.all().delete()
                self.stdout.write(
                    self.style.SUCCESS("Camp images data cleared successfully.")
                )
            case "refresh":
                CampImage.objects.all().delete()
                camps = Camp.objects.all()
                for camp in camps:
                    imgs = images.copy()
                    shuffle(imgs)
                    for img in imgs:
                        CampImage.objects.create(camp=camp, image=img)

                self.stdout.write(
                    self.style.SUCCESS("Camp images data seeded successfully.")
                )
            case _:
                self.stdout.write(
                    self.style.ERROR("Invalid mode. Use either `refresh` or `clear`.")
                )
