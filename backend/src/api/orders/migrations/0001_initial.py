# Generated by Django 5.0.6 on 2024-05-30 03:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('camps', '0010_camplike'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_status', models.CharField(choices=[('Pending', 'Pending'), ('Succeeded', 'Succeeded'), ('Failed', 'Failed')], default='Pending', max_length=20)),
                ('camp', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='camps.camp')),
                ('camp_occupancy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='camps.campoccupancy')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
                'ordering': ['-created_at'],
            },
        ),
    ]