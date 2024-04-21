# Generated by Django 5.0.4 on 2024-04-21 03:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('camps', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='camp',
            name='latitude',
            field=models.DecimalField(decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='camp',
            name='longitude',
            field=models.DecimalField(decimal_places=6, max_digits=9, null=True),
        ),
    ]
