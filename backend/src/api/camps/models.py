from datetime import datetime
from typing import Any
from django.db import models
from django.db.models import Q, Sum, Avg
from api.users.models import User
from api.tags.models import Tag
from api.features.models import Feature


class Camp(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    about = models.TextField(blank=False, null=False)
    check_in_at = models.TimeField(blank=False, null=False)
    check_out_at = models.TimeField(blank=False, null=False)
    # max occupancy
    occupancy_count = models.PositiveIntegerField(blank=False, null=False)
    per_night_cost = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False, null=False
    )
    is_active = models.BooleanField(default=True)
    tags = models.ManyToManyField(Tag, related_name="camps", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="camps", blank=False, null=True
    )
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, blank=False, null=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, blank=False, null=True
    )

    def average_rating(self: Any):
        return self.reviews.aggregate(Avg("rating"))["rating__avg"]


class CampFeature(models.Model):
    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="features")
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE, related_name="camps")
    is_available = models.BooleanField(blank=False, null=False)


class CampImageManager(models.Manager):
    def camp_preview_images(self, limit=10):
        return (
            self.all()
            .order_by("-created_at")[:limit]
            .annotate(total_images=models.Count("id"))
        )


class CampImage(models.Model):
    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="images/camps/")
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CampImageManager()


class CampOccupancyManager(models.Manager):
    def check_camp_availability(
        self, camp_id: int, check_in: datetime, check_out: datetime
    ):
        queryset = self.filter(camp=camp_id)

        # Get guests count during check_in and check_out

        # Overlaps
        # in ################ out
        #
        # 1. checkout <= my_checkin
        # 2. checkin >= my_checkout
        # 3. checkin <= my_checkin and checkout >= my_checkout
        # 4. checkin >= my_checkin and checkout <= my_checkout

        overlapping_occupancies = queryset.filter(
            (
                (Q(check_out__gte=check_in) & Q(check_in__lte=check_in))
                | (Q(check_in__lte=check_out) & Q(check_out__gte=check_out))
                | (Q(check_in__lte=check_in) & Q(check_out__gte=check_out))
                | (Q(check_in__gte=check_in) & Q(check_out__lte=check_out))
            )
        )

        overlapping_occupancies = overlapping_occupancies.annotate(
            total_guests=Sum("adult_guests_count")
            + Sum("child_guests_count")
            + Sum("pets_count") / 2
        )

        return overlapping_occupancies


class CampOccupancy(models.Model):
    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="occupancies")
    check_in = models.DateField(blank=False, null=False)
    check_out = models.DateField(blank=False, null=False)
    adult_guests_count = models.PositiveIntegerField(blank=False, null=False, default=0)
    child_guests_count = models.PositiveIntegerField(blank=False, null=False, default=0)
    pets_count = models.PositiveIntegerField(blank=False, null=False, default=0)

    objects = CampOccupancyManager()
