# Generated by Django 5.0.7 on 2025-01-25 14:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0012_budget_end_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="budget",
            name="start_date",
            field=models.DateField(default=datetime.date(2025, 1, 25)),
        ),
    ]
