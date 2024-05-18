from datetime import datetime
from typing import Any
from django.db import models
from django.db.models import Q, Sum, Avg
from api.users.models import User
from api.tags.models import Tag
from api.features.models import Feature

# ========================================
# Camp model
# ========================================


class Camp(models.Model):
    """
    A model for storing camp core info like its info, location, cost, and count.
    Some fields have relations with other models like tags, and created_by user.
    Some models that are related to this model are CampFeature, CampImage
    """

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
    address = models.CharField(max_length=255, blank=False, null=False)

    def average_rating(self: Any):
        """Get average rating of the camp from reviews."""
        return self.reviews.aggregate(Avg("rating"))["rating__avg"]

    def overall_rating(self: Any):
        """
        Get overall rating percentage (eg: 83%, 26%). Since rating is out of 5, we multiply
        average rating by 20. So, 4.5 rating will be 90%.
        """
        return self.average_rating() * 20

    def total_reviews(self: Any):
        """Get total reviews count for the camp."""
        return self.reviews.count()

    def __str__(self) -> str:
        return self.name


# ========================================
# Camp feature model
# ========================================


def validate_description(value: Any) -> None:
    if isinstance(value, str) and len(value.strip()) < 10:
        raise ValueError("Description is too short")


class CampFeature(models.Model):
    """
    A "bucket" model for linking camps with features, and giving extra info about feature's
    availabiliy/not-availability for a camp.
    """

    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="features")
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE, related_name="camps")
    description = models.TextField(
        blank=False,
        null=False,
        max_length=1024,
        validators=[validate_description],
    )
    is_available = models.BooleanField(blank=False, null=False)

    def __str__(self) -> str:
        return f"{self.camp.name} - {self.feature.label}"

    class Meta:
        verbose_name = "Camp Feature"
        verbose_name_plural = "Camp Features"


# ========================================
# Camp image model
# ========================================


class CampImageManager(models.Manager):
    """Custom camp image manager."""

    def camp_preview_images(self, camp_id: int, limit=10):
        """Get few images when initially displaying camp."""

        result = self.filter(camp=camp_id).order_by("-created_at")[:limit]
        return result


class CampImage(models.Model):
    """
    Camp images are store using this model. This model has a relation with the camp model.
    """

    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="images/camps/")
    alt_text = models.CharField(max_length=256, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CampImageManager()

    class Meta:
        verbose_name = "Camp Image"
        verbose_name_plural = "Camp Images"


# ========================================
# Camp occupancy model
# ========================================


class CampOccupancyManager(models.Manager):
    """Manager with methods for custom filtering."""

    def check_camp_availability(
        self, camp_id: int, check_in: datetime, check_out: datetime
    ) -> "CampOccupancyManager":
        """
        Filter the queryset to get "bookings" (occupancy) which overlap with check in and check out
        dates. This method is useful to check whether occupancy is full or not during a specific
        time period.
        """

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
    """
    Whenever a booking for a camp is done, the occpuancy of the camp for those check in and check out duration
    have to be blocked so that for the next booking we can check whether the camp has space available or not.
    """

    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="occupancies")
    check_in = models.DateField(blank=False, null=False)
    check_out = models.DateField(blank=False, null=False)
    adult_guests_count = models.PositiveIntegerField(blank=False, null=False, default=0)
    child_guests_count = models.PositiveIntegerField(blank=False, null=False, default=0)
    pets_count = models.PositiveIntegerField(blank=False, null=False, default=0)

    objects = CampOccupancyManager()

    class Meta:
        verbose_name = "Camp Occupancy"
        verbose_name_plural = "Camp Occupancies"


# ========================================
# Camp like model
# ========================================


class CampLike(models.Model):
    """
    A model to store likes for a camp. A user can like a camp only once.
    """

    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked_camps")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("camp", "user")
        verbose_name = "Camp Like"
        verbose_name_plural = "Camp Likes"
