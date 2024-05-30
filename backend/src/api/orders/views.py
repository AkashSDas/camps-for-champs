from datetime import datetime
from math import floor
from os import getenv
from typing import Any, cast
from deprecated import deprecated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from api.orders.models import Order
from api.users.models import User
from api.camps.models import Camp, CampOccupancy, CampOccupancyManager
from api.orders.serializers import CreateOrderSerializer, GetOrderSerializer
import stripe


stripe.api_key = getenv("STRIPE_SECRET_KEY")


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


@deprecated(version="1.0", reason="Use payment intents instead.")
def charge_user(user: User, amount: float) -> stripe.Charge:
    try:
        customer = get_or_create_customer(user)
        charge = stripe.Charge.create(
            customer=customer.id,
            amount=int(amount * 100),
            currency="usd",
            description="Camp booking",
        )

        return charge
    except stripe.StripeError as e:
        print(e)
        raise ValueError("Failed to charge customer")


def create_payment_intent_and_charge(
    user_id: int, amount: float, payment_method: str = "card"
) -> stripe.PaymentIntent:
    try:
        user = User.objects.get(pk=user_id)
        if not user:
            raise ValueError("User not found")

        customer = get_or_create_customer(user)
        stripe.PaymentMethod.attach(payment_method, customer=customer.id)
        stripe.Customer.modify(
            customer.id,
            invoice_settings={"default_payment_method": payment_method},
        )

        payment_intent = stripe.PaymentIntent.create(
            customer=customer.id,
            amount=int(amount * 100),
            currency="usd",
            off_session=True,
            confirm=True,
            receipt_email=user.email,
            payment_method=payment_method,
        )

        return payment_intent
    except stripe.StripeError as e:
        print(e)
        raise ValueError("Failed to charge customer")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def book_camp(req: Request, camp_id: int, *args, **kwargs) -> Response:
    """
    Handle booking camp space and charging the user.

    1. validate booking payload
    2. get camp for amount calculation and available occupancy
    3. check if the camp is available for the given dates
    4. create an order
    5. charge the user
    6. return the order details
    """

    serializer = CreateOrderSerializer(data=req.data)
    serializer.is_valid(raise_exception=True)
    payload = cast(dict[str, Any], serializer.validated_data)
    adult_guests: int = payload["adult_guests_count"]
    child_guests: int = payload["child_guests_count"]
    pets: int = payload["pets_count"]
    total_guests: int = adult_guests + round(child_guests / 2) + round(pets / 2)
    check_in: datetime = payload["check_in"]
    check_out: datetime = payload["check_out"]
    payment_method: str = payload["payment_method"]

    user = req.user
    camp = Camp.objects.get(pk=camp_id)
    if not camp:
        return Response({"message": "Camp not found"}, status=404)

    # check if space is available

    occupany = (
        cast(CampOccupancyManager, CampOccupancy.objects)
        .check_camp_availability(
            camp_id=camp_id, check_in=check_in, check_out=check_out
        )
        .first()
    )

    if occupany and (
        occupany.total_guests >= camp.occupancy_count
        or occupany.total_guests + total_guests > camp.occupancy_count
    ):
        return Response(
            {"message": "Camp is full for the given dates"},
            status=400,
        )
    if total_guests > camp.occupancy_count:
        return Response(
            {"message": "Guests count exceeds camp occupancy limit"},
            status=400,
        )

    # get price for the booking

    num_of_days = (check_out - check_in).days
    num_of_days = num_of_days if num_of_days > 0 else 1
    occupancy_to_be_considered = floor(total_guests / 4)
    occupancy_to_be_considered = (
        occupancy_to_be_considered if occupancy_to_be_considered > 0 else 1
    )
    cost = occupancy_to_be_considered * int(camp.per_night_cost)
    total_cost = cost * num_of_days

    # create camp occupancy and order

    camp_occupancy = CampOccupancy.objects.create(
        camp=camp,
        check_in=check_in,
        check_out=check_out,
        adult_guests_count=adult_guests,
        child_guests_count=child_guests,
        pets_count=pets,
    )

    order = Order.objects.create(
        camp=camp,
        camp_occupancy=camp_occupancy,
        user=user,
        amount=total_cost,
    )

    # charge the user

    try:
        payment_intent = create_payment_intent_and_charge(
            user_id=user.pk,
            amount=total_cost,
            payment_method=payment_method,
        )
        order.payment_status = payment_intent.status
        order.payment_id = payment_intent.id
        order.save()

        return Response(
            {
                "message": "Camp booked successfully",
                "order": GetOrderSerializer(order).data,
                "success": True,
            }
        )
    except ValueError as e:
        return Response({"message": str(e), "success": False}, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_orders(req: Request, *args, **kwargs) -> Response:
    """Get all orders for the authenticated user."""

    user = req.user
    orders = Order.objects.filter(user=user)
    orders_data = GetOrderSerializer(orders, many=True).data
    return Response({"orders": orders_data})
