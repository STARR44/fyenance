# Generated by Django 5.0.7 on 2025-01-24 03:13

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0009_category_count_category_percentage_category_user_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="basetransaction",
            name="date_created",
            field=models.DateField(default=datetime.date.today),
        ),
    ]
