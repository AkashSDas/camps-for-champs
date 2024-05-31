from os import getenv
from typing import Any, cast
from django.shortcuts import render
import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.payments.serializers import PaymentIntentSerializer
from api.users.models import User

stripe.api_key = getenv("STRIPE_SECRET_KEY")

# ====================================
# Payment helper functions
# ====================================


def create_payment_intent(
    amount: float, receipt_email: str, customer_id: str
) -> stripe.PaymentIntent:
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),
            currency="usd",
            automatic_payment_methods={"enabled": True},
            receipt_email=receipt_email,
            customer=customer_id,
        )
        return payment_intent
    except stripe.StripeError as e:
        print(e)
        raise ValueError("Failed to create payment intent")


def get_or_create_customer(user: User) -> stripe.Customer:
    if not user.stripe_customer_id:
        customer = stripe.Customer.create(email=user.email)
        user.stripe_customer_id = customer.id
        user.save()
        return customer

    customer = stripe.Customer.retrieve(id=user.stripe_customer_id)
    if not customer:
        customer = stripe.Customer.create(email=user.email)
        user.stripe_customer_id = customer.id
        user.save()
        return customer

    return customer


# ====================================
# Payment intent view
# ====================================


class PaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        This will return payment intent i.e. client secret which is needed to
        render payment form.
        """

        serializer = PaymentIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = cast(dict[str, Any], serializer.validated_data)

        user = request.user
        amount = payload["amount"]
        receipt_email = user.email
        customer_id = get_or_create_customer(user).id

        try:
            payment_intent = create_payment_intent(amount, receipt_email, customer_id)
            return Response(
                {"payment_intent": payment_intent},
                status=status.HTTP_201_CREATED,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
