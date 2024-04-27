# Generated by Django 5.0.4 on 2024-04-27 06:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('camps', '0005_alter_campimage_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='CampOccupancy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('check_in', models.DateField()),
                ('check_out', models.DateField()),
                ('adult_guests_count', models.PositiveIntegerField(default=0)),
                ('child_guests_count', models.PositiveIntegerField(default=0)),
                ('pets_count', models.PositiveIntegerField(default=0)),
                ('camp', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='occupancies', to='camps.camp')),
            ],
        ),
    ]
