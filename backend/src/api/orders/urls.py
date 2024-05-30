from django.urls import path
from .views import get_orders, book_camp


urlpatterns = [
    path("camps/<int:camp_id>/pay/", book_camp, name="book-camp"),
    path("", get_orders, name="get-orders"),
]
