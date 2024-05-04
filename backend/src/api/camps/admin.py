from django.contrib import admin
from api.camps.models import Camp, CampFeature, CampImage, CampOccupancy


class CampAdmin(admin.ModelAdmin):
    """Custom interface for camp admin panel."""

    list_display = [
        "name",
        "occupancy_count",
        "per_night_cost",
        "is_active",
        "created_by",
        # "display_features",
    ]
    list_filter = ["is_active"]
    search_fields = ["name", "about", "created_by__email", "tags__label"]
    ordering = ["-created_at"]

    # def display_features(self, obj):
    #     return ", ".join([feature.feature.label for feature in obj.features.all()])

    # display_features.short_description = "Features"


class CampFeatureAdmin(admin.ModelAdmin):
    """Custom interface for camp feature admin panel."""

    list_display = ["camp_name", "feature_label", "feature_type", "is_available"]
    list_filter = ["feature__feature_type"]
    search_fields = ["camp__name", "feature__label"]
    ordering = ["camp", "feature"]

    def camp_name(self, obj):
        return obj.camp.name

    def feature_label(self, obj):
        return obj.feature.label

    def feature_type(self, obj):
        return obj.feature.feature_type

    camp_name.short_description = "Camp Name"
    feature_label.short_description = "Feature Label"
    feature_type.short_description = "Feature Type"


class CampImageAdmin(admin.ModelAdmin):
    """Custom interface for camp image admin panel."""

    list_display = ["camp_name", "image"]
    search_fields = ["camp__name"]
    ordering = ["camp"]

    def camp_name(self, obj):
        return obj.camp.name

    camp_name.short_description = "Camp Name"


class CampOccupancyAdmin(admin.ModelAdmin):
    """Custom interface for camp occupancy admin panel."""

    list_display = ["camp_name", "total_occupancy", "check_in", "check_out"]
    search_fields = ["camp__name"]
    ordering = ["camp"]
    date_hierarchy = "check_in"

    def camp_name(self, obj):
        return obj.camp.name

    def total_occupancy(self, obj):
        return obj.adult_guests_count + obj.child_guests_count + obj.pets_count

    camp_name.short_description = "Camp Name"
    total_occupancy.short_description = "Total Occupancy"


admin.site.register(Camp, CampAdmin)
admin.site.register(CampFeature, CampFeatureAdmin)
admin.site.register(CampImage, CampImageAdmin)
admin.site.register(CampOccupancy, CampOccupancyAdmin)
