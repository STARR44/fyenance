# Generated by Django 5.0.7 on 2025-01-08 14:27

import api.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_basetransaction_id_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="basetransaction",
            name="id",
        ),
        migrations.AddField(
            model_name="basetransaction",
            name="budget",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="transactions",
                to="api.budget",
            ),
        ),
        migrations.AddField(
            model_name="basetransaction",
            name="budget_name",
            field=models.CharField(default="", editable=False, max_length=150),
        ),
        migrations.AddField(
            model_name="basetransaction",
            name="category_name",
            field=models.CharField(default="", editable=False, max_length=150),
        ),
        migrations.AlterField(
            model_name="basetransaction",
            name="date_created",
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name="basetransaction",
            name="transaction_id",
            field=models.CharField(
                default=api.models.generate_transaction_id,
                max_length=8,
                primary_key=True,
                serialize=False,
            ),
        ),
        migrations.AlterField(
            model_name="budget",
            name="amount_left",
            field=models.DecimalField(decimal_places=2, default="0.00", max_digits=10),
        ),
        migrations.AlterField(
            model_name="category",
            name="name",
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
