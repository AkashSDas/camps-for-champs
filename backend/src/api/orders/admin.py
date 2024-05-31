from django.contrib import admin
from api.orders.models import Order


class OrderModel(admin.ModelAdmin):
    list_display = [
        "camp",
        "camp_occupancy",
        "user",
        "created_at",
        "amount",
        "payment_status",
        "booking_status",
    ]
    list_filter = ["payment_status"]
    search_fields = ["camp", "user"]
    ordering = ["-created_at"]


admin.site.register(Order, OrderModel)
