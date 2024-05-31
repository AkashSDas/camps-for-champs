from django.urls import path
from .views import get_orders, init_camp_booking, confirm_camp_booking


urlpatterns = [
    path("camps/<int:camp_id>/", init_camp_booking, name="init-camp-booking"),
    path(
        "camps/<int:camp_id>/orders/<int:order_id>/",
        confirm_camp_booking,
        name="confirm-camp-booking",
    ),
    path("", get_orders, name="get-orders"),
]
