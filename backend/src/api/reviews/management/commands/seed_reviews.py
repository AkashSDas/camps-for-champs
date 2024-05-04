# https://stackoverflow.com/questions/51577441/how-to-seed-django-project-insert-a-bunch-of-data-into-the-project-for-initi

from typing import Literal, TypedDict
from django.core.management.base import BaseCommand
from api.camps.models import Camp
from api.reviews.models import Review
from api.users.models import User
from random import randint

# python manage.py seed_reviews --mode=refresh
Mode = Literal["refresh", "clear"]
"""
Mode of the seed command:
- refresh: Clear all data and creates new ones
- clear: Clear all data and do not create any object
"""


class DummyReview(TypedDict):
    rating: int
    comment: str


dummy_data: list[DummyReview] = [
    {"rating": 1, "comment": "I had a terrible experience at this campsite."},
    {"rating": 2, "comment": "The campsite was not as good as I expected."},
    {"rating": 3, "comment": "The campsite was okay."},
    {"rating": 4, "comment": "I had a good experience at this campsite."},
    {"rating": 5, "comment": "The campsite was amazing! Highly recommended."},
    {"rating": 1, "comment": "I had a terrible experience at this campsite."},
    {"rating": 3, "comment": "The campsite was far from the city."},
    {"rating": 4, "comment": "I and my friends had a great time at this campsite."},
    {"rating": 5, "comment": "It was first time camping and I loved it."},
]
"""Dummy data for seeding reviews."""


class Command(BaseCommand):
    help = "Seed reviews data for testing and development."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--mode", type=str, help="Mode of the seed command: refresh / clear"
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write("[seed:reviews]: START")
        mode = options["mode"]
        success_msg = ""

        match mode:
            case "clear":
                Review.objects.all().delete()
                success_msg = "Cleared all review data"
                self.stdout.write(self.style.SUCCESS(f"[seed:features]: {success_msg}"))
            case "refresh":
                Review.objects.all().delete()
                camps = Camp.objects.all()
                users = User.objects.all()

                for camp in camps:
                    for user in users:
                        review = dummy_data[randint(0, len(dummy_data) - 1)]
                        Review.objects.create(
                            camp=camp,
                            author=user,
                            rating=review["rating"],
                            comment=review["comment"],
                            is_public=True,
                            helpful_count=randint(0, 30),
                        )

                success_msg = "Refreshed review data"
                self.stdout.write(self.style.SUCCESS(f"[seed:reviews]: {success_msg}"))
            case _:
                self.stdout.write(self.style.ERROR("[seed:reviews]: Invalid mode"))
