from django.db import models
from django.utils import timezone
from accounts.models import FyenanceUser
from django.conf import settings
from django.urls import reverse

class Category(models.Model):
    name = models.CharField(max_length=50)
    colour = models.CharField(max_length=7)

    def __str__(self): 
        return f"{self.name} - #{self.colour}"

class BaseTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("Expense", "Expense"),
        ("Income", "Income"),
    ]

    id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_created = models.DateField(default=timezone.now)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transaction_owner")
    type = models.CharField(max_length=50, choices=TRANSACTION_TYPES, default="Expense", null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="expense_category", null=True, blank=True)

    def clean(self):
        if self.type != "Expense" and self.category is not None:
            raise ValueError("Category can only be specified for transactions of type 'Expense'.")

    def __str__(self):
        return f"{self.id} - {self.type} - ${self.amount}"

class Budget(models.Model):
    name = models.CharField(max_length=50)
    amount_allocated = models.DecimalField(max_digits=10, decimal_places=2)
    amount_left = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(default=timezone.now)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="budget_owner")
    @property
    def status(self):
        if self.start_date > timezone.now().date():
            return "Inactive"
        else:
            return "Active"


    def __str__(self):
        return f"{self.name} - ${self.amount_allocated}"

    


