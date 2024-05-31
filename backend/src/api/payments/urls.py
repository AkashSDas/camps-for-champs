from django.urls import path
from .views import PaymentIntentView


urlpatterns = [
    path("payment-intent/", PaymentIntentView.as_view(), name="payment-intent"),
]
