from django.db import models
from django.utils import timezone
import datetime
from accounts.models import FyenanceUser
from django.conf import settings
import random, string
from django.urls import reverse

class Category(models.Model):
    name = models.CharField(max_length=50)
    colour = models.CharField(max_length=7)

    def __str__(self): 
        return f"{self.name} - #{self.colour}"

def generate_transaction_id():
    length = 8

    while True:
        code = ''.join(random.choices(string.hexdigits, k=length))
        if BaseTransaction.objects.filter(transaction_id=code).count() == 0:
            break

    return code

class BaseTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("Expense", "Expense"),
        ("Income", "Income"),
    ]

    # transaction_id = models.CharField(max_length=8, default=generate_transaction_id, primary_key=True)
    transaction_id = models.CharField(max_length=8, default=generate_transaction_id)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_created = models.DateField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transaction_owner")
    type = models.CharField(max_length=50, choices=TRANSACTION_TYPES, default="Expense", null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="expense_category", null=True, blank=True)
    user_username = models.CharField(max_length=150, editable=False, default="")

    def clean(self):
        if self.type != "Expense" and self.category is not None:
            raise ValueError("Category can only be specified for transactions of type 'Expense'.")

    def save(self, *args, **kwargs):
        self.user_username = self.user.username  # Automatically populate the username field
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.type} - ${self.amount}"

class Budget(models.Model):
    name = models.CharField(max_length=50)
    amount_allocated = models.DecimalField(max_digits=10, decimal_places=2)
    amount_left = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(default=timezone.now)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="budget_owner")
    user_username = models.CharField(max_length=150, editable=False, default="")
    @property
    def status(self):
        if self.start_date > timezone.now().date():
            return "Inactive"
        else:
            return "Active"

    def save(self, *args, **kwargs):
        self.user_username = self.user.username  # Automatically populate the username field
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - ${self.amount_allocated}"

    


