from django.contrib import admin
from api.reviews.models import Review


class ReviewAdmin(admin.ModelAdmin):
    """
    Customizing the interface of the Review model in the Admin Page.
    """

    list_display = ["author", "camp", "rating", "is_public"]
    list_filter = ["is_public", "rating"]
    search_fields = ["author__email", "camp__name"]
    ordering = ["-created_at"]

    def get_readonly_fields(self, request, obj=None):
        """
        Make the author field readonly.
        """
        if obj:
            return ["author"]
        return []

    # def save_model(self, request, obj, form, change):
    #     """
    #     Set the author field to the current user.
    #     """
    #     if not obj.author:
    #         obj.author = request.user
    #     obj.save()


admin.site.register(Review, ReviewAdmin)
