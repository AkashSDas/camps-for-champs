from django.contrib import admin
from api.tags.models import Tag


class TagAdmin(admin.ModelAdmin):
    """
    Customizing the interface of the Tag model in the Admin Page.
    """

    list_display = ["label"]
    search_fields = ["label"]
    ordering = ["label"]


admin.site.register(Tag, TagAdmin)
