# Generated by Django 5.0.7 on 2025-01-25 03:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0011_alter_basetransaction_amount"),
    ]

    operations = [
        migrations.AddField(
            model_name="budget",
            name="end_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
