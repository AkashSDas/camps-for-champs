from django.apps import AppConfig


class UserConfig(AppConfig):
    name = 'api.user'

    def ready(self):
        from . import signals
