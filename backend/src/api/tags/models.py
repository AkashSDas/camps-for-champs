from typing import Any
from django.db import models
from django.forms import ValidationError

# ================================
# Validators
# ================================


def validate_label(value: Any):
    if not isinstance(value, str):
        raise ValidationError("Label must be a string")
    if len(value.strip()) < 3:
        raise ValidationError("Label is too short")


# ================================
# Models
# ================================


class Tag(models.Model):
    """
    This model is used to store general tags, and this can be used in other models
    like `Camp` and attaching tags to a camp.
    """

    label = models.CharField(
        unique=True,
        blank=False,
        null=False,
        max_length=128,
        db_index=True,
        verbose_name="Tag label",
        help_text="Enter a tag label",
        validators=[validate_label],
    )

    def __str__(self):
        return self.label

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ["label"]
