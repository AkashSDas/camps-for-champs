from datetime import datetime
from os import getenv
from typing import Any, cast
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from api.orders.models import BookingStatus, Order, PaymentStatus
from api.camps.models import Camp, CampOccupancy, CampOccupancyManager
from api.orders.serializers import CreateOrderSerializer, GetOrderSerializer
import stripe


stripe.api_key = getenv("STRIPE_SECRET_KEY")


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def confirm_camp_booking(
    req: Request, camp_id: int, order_id: int, *args, **kwargs
) -> Response:
    """
    Confirm camp booking process.

    1. get order and camp
    2. verify the user
    3. confirm booking
    """

    user = req.user
    order = Order.objects.get(pk=order_id)
    if not order:
        return Response({"message": "Order not found"}, status=404)

    camp = Camp.objects.get(pk=camp_id)
    if not camp:
        return Response({"message": "Camp not found"}, status=404)

    if order.user != user:
        return Response({"message": "Unauthorized"}, status=401)
    if not order.payment_intent:
        return Response(
            {"message": "Payment intent not found"},
            status=400,
        )

    payment_intent = stripe.PaymentIntent.confirm(intent=order.payment_intent)
    if payment_intent.status != "succeeded":
        return Response(
            {"message": "Payment intent confirmation failed"},
            status=400,
        )

    order.booking_status = BookingStatus.FULLFILLED.value
    order.save()

    return Response(
        {
            "message": "Booking confirmed successfully",
            "order": GetOrderSerializer(order).data,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def init_camp_booking(req: Request, camp_id: int, *args, **kwargs) -> Response:
    """
    Initialize camp booking process.

    1. validate booking payload
    2. check if the camp is available for the given dates
    3. create an order
    """

    # validate booking payload

    serializer = CreateOrderSerializer(data=req.data)
    serializer.is_valid(raise_exception=True)
    payload = cast(dict[str, Any], serializer.validated_data)
    adult_guests: int = payload["adult_guests_count"]
    child_guests: int = payload["child_guests_count"]
    pets: int = payload["pets_count"]
    total_guests: int = adult_guests + round(child_guests / 2) + round(pets / 2)
    check_in: datetime = payload["check_in"]
    check_out: datetime = payload["check_out"]
    payment_intent: str = payload["payment_intent"]

    user = req.user
    camp = Camp.objects.get(pk=camp_id)
    if not camp:
        return Response({"message": "Camp not found"}, status=404)

    # delete the pending order if any

    Order.objects.filter(
        user=user, camp=camp, payment_status=PaymentStatus.INITIALIZED.value
    ).delete()
    CampOccupancy.objects.filter(
        camp=camp, check_in=check_in, check_out=check_out
    ).delete()

    # check if the camp is available for the given dates

    occupany = cast(
        CampOccupancyManager, CampOccupancy.objects
    ).check_camp_availability(camp_id=camp_id, check_in=check_in, check_out=check_out)
    occupany_count = occupany["total_guests"]
    occupany_count = occupany_count if occupany_count else 0

    if occupany and (
        occupany_count >= camp.occupancy_count
        or occupany_count + total_guests > camp.occupancy_count
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

    num_of_days = (check_out - check_in).days
    num_of_days = num_of_days if num_of_days > 0 else 1
    occupancy_to_be_considered = round(total_guests / 4)
    occupancy_to_be_considered = (
        occupancy_to_be_considered if occupancy_to_be_considered > 0 else 1
    )
    cost = occupancy_to_be_considered * int(camp.per_night_cost)
    total_cost = cost * num_of_days

    # create an order

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
        payment_intent=payment_intent,
    )

    return Response(
        {
            "message": "Booking initialized successfully",
            "order": GetOrderSerializer(order).data,
        },
        status=201,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_orders(req: Request, *args, **kwargs) -> Response:
    """Get all orders for the authenticated user."""

    user = req.user
    orders = Order.objects.filter(user=user)
    orders_data = GetOrderSerializer(orders, many=True).data
    return Response({"orders": orders_data})


# http://localhost:3000/orders?bookingSuccess=true&payment_intent=pi_1PMX4CIW9OOyJTj3B0dxb2dU&payment_intent_client_secret=pi_1PMX4CIW9OOyJTj3B0dxb2dU_secret_jI2QVf1GhXmJq4BCLcIa1ZEyt&redirect_status=succeeded
