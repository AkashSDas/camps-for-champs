from enum import Enum, unique
from typing import Any
from django.db import models
from django.forms import ValidationError

# ================================
# Validators
# ================================


def validate_label(value: Any) -> None:
    if not isinstance(value, str):
        raise ValidationError("Label must be a string")
    if len(value.strip()) < 3:
        raise ValidationError("Label is too short")


def validate_description(value: Any) -> None:
    if isinstance(value, str) and len(value.strip()) < 10:
        raise ValueError("Description is too short")


# ================================
# Enums
# ================================


@unique
class FeatureType(Enum):
    """General features avaialble for campsites."""

    HIGHLIGHT = "highlight"  # family friendly, pet friendly, etc.
    SURROUNDING = "surrounding"  # mountain view, sea view, etc.
    ACTIVITY = "activity"  # hiking, biking, etc.


# ================================
# Models
# ================================


class Feature(models.Model):
    """
    This model is used to store general campsite features. This is different from the `CampFeature` model.
    `CampFeature` model is used to store a specific campsite's features with those features specific info.
    """

    feature_type = models.CharField(
        max_length=32,
        # [(value, display_name)]
        choices=[(tag.value, tag.value) for tag in FeatureType],
        blank=False,
        null=False,
    )
    label = models.CharField(
        unique=True,
        blank=False,
        null=False,
        max_length=128,
        db_index=True,
        validators=[validate_label],
    )
    description = models.TextField(
        blank=False,
        null=False,
        max_length=1024,
        validators=[validate_description],
    )
    """
    This field tells what this label is about rather explaining what the feature is because
    expaling what the feature is will be done in camp feature model
    """

    def __str__(self):
        return self.label

    class Meta:
        verbose_name = "Feature"
        verbose_name_plural = "Features"
        ordering = ["feature_type", "label"]
