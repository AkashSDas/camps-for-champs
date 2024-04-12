from enum import Enum, unique
from typing import Any
from django.db import models
from api.tags.models import validate_label


@unique
class FeatureType(Enum):
    CAMP_SITE = "camp_site"
    SURROUNDINGS = "surroundings"


def validate_description(value: Any):
    if isinstance(value, str) and len(value.strip()) < 10:
        raise ValueError("Description is too short")


class Feature(models.Model):
    feature_type = models.CharField(
        max_length=20,
        choices=[(tag.name, tag.value) for tag in FeatureType],
        blank=False,
        null=False,
    )
    label = models.CharField(
        unique=True,
        blank=False,
        null=False,
        max_length=100,
        db_index=True,
        validators=[validate_label],
    )
    description = models.TextField(
        blank=True,
        null=False,
        max_length=1000,
        validators=[validate_description],
    )

    def __str__(self):
        return self.label

    class Meta:
        verbose_name = "Feature"
        verbose_name_plural = "Features"
        ordering = ["feature_type", "label"]
