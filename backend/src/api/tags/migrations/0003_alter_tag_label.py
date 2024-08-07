# Generated by Django 5.0.4 on 2024-05-04 07:22

import api.tags.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tags', '0002_alter_tag_label'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='label',
            field=models.CharField(db_index=True, help_text='Enter a tag label', max_length=128, unique=True, validators=[api.tags.models.validate_label], verbose_name='Tag label'),
        ),
    ]
