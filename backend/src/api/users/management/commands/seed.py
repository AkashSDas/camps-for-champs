# https://stackoverflow.com/questions/51577441/how-to-seed-django-project-insert-a-bunch-of-data-into-the-project-for-initi

from typing import Literal
from django.core.management.base import BaseCommand
from users.models import User

# python manage.py seed --mode=refresh
Mode = Literal["refresh", "clear"]
"""
Mode of the seed command:
- refresh: Clear all data and creates addresses
- clear: Clear all data and do not create any object
"""


class Command(BaseCommand):
    help = "Seed user data for testing and development."

    def add_arguments(self, parser) -> None:
        parser.add_argument("--mode", type=str, help="Mode")

    def handle(self, *args, **options):
        self.stdout.write("[seed:user]: START")
        self.run_seed(options["mode"])
        self.stdout.write("[seed:user]: DONE")

    def run_seed(self, mode: Mode):
        match mode:
            case "clear":
                User.objects.all().exclude(email="akash@gmail.com").delete()
            case "refresh":
                pass
                # User.objects.all().delete()
                # self.create_users()
            case _:
                raise Exception("Invalid mode")
