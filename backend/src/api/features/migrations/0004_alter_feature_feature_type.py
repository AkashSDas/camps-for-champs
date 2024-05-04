# Generated by Django 5.0.4 on 2024-05-04 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('features', '0003_alter_feature_description_alter_feature_feature_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feature',
            name='feature_type',
            field=models.CharField(choices=[('highlight', 'HIGHLIGHT'), ('surrounding', 'SURROUNDING'), ('activity', 'ACTIVITY')], max_length=32),
        ),
    ]