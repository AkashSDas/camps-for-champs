from django.contrib import admin
from api.features.models import Feature


class FeatureAdmin(admin.ModelAdmin):
    """
    Customizing the interface of the Feature model in the Admin Page.
    """

    list_display = ["label", "feature_type"]
    list_filter = ["feature_type"]
    search_fields = ["label", "feature_type"]
    ordering = ["feature_type", "label"]


# Registering Feature model and its interface in admin page
admin.site.register(Feature, FeatureAdmin)
