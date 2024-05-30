from django.db import models
from api.users.admin import User
from api.camps.models import Camp, CampOccupancy


class BookingStatus(models.TextChoices):
    """
    This class is used for storing booking status choices.
    """

    PENDING = "Pending"
    FULLFILLED = "Fullfilled"


class PaymentStatus(models.TextChoices):
    """
    This class is used for storing payment status choices.
    """

    # PENDING = "PENDING", "Pending"
    # PAID = "PAID", "Paid"
    # FAILED = "FAILED", "Failed"

    PENDING = "Pending"
    SUCCEEDED = "Succeeded"
    FAILED = "Failed"


class Order(models.Model):
    """
    This model is used for storing order details -- camp, occupancy id, camp id,
    amount, payment status.
    """

    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="orders")
    camp_occupancy = models.ForeignKey(
        CampOccupancy, on_delete=models.CASCADE, related_name="orders"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="orders", blank=False, null=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False, null=False
    )
    payment_status = models.CharField(
        max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    payment_id = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.get_username()} - {self.camp}"

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ["-created_at"]
