# Generated by Django 5.0.4 on 2024-04-12 05:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('features', '0002_alter_feature_feature_type'),
        ('tags', '0002_alter_tag_label'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Camp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('about', models.TextField()),
                ('check_in_at', models.TimeField()),
                ('check_out_at', models.TimeField()),
                ('occupancy_count', models.PositiveIntegerField()),
                ('per_night_cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='camps', to=settings.AUTH_USER_MODEL)),
                ('tags', models.ManyToManyField(blank=True, related_name='camps', to='tags.tag')),
            ],
        ),
        migrations.CreateModel(
            name='CampFeature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_available', models.BooleanField()),
                ('camp', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='features', to='camps.camp')),
                ('feature', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='camps', to='features.feature')),
            ],
        ),
    ]
