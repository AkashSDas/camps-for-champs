from django.db import models
from api.users.models import User
from api.tags.models import Tag
from api.features.models import Feature


class Camp(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    about = models.TextField(blank=False, null=False)
    check_in_at = models.TimeField(blank=False, null=False)
    check_out_at = models.TimeField(blank=False, null=False)
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


class CampFeature(models.Model):
    camp = models.ForeignKey(Camp, on_delete=models.CASCADE, related_name="features")
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE, related_name="camps")
    is_available = models.BooleanField(blank=False, null=False)
