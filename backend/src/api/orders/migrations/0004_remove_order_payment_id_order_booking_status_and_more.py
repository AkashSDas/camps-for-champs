# Generated by Django 5.0.6 on 2024-05-31 12:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_alter_order_payment_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='payment_id',
        ),
        migrations.AddField(
            model_name='order',
            name='booking_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Fullfilled', 'Fullfilled')], default='Pending', max_length=64),
        ),
        migrations.AlterField(
            model_name='order',
            name='payment_status',
            field=models.CharField(choices=[('Initialized', 'Initialized'), ('Failed', 'Failed'), ('Completed', 'Completed')], default='Initialized', max_length=64),
        ),
    ]
