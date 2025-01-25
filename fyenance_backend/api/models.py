from django.db import models
from django.utils import timezone
import datetime
from accounts.models import FyenanceUser
from django.conf import settings
import random, string
from django.urls import reverse
from django.core.exceptions import ValidationError

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    colour = models.CharField(max_length=7)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="category_owner")
    user_username = models.CharField(max_length=150, editable=False, default="")
    count = models.IntegerField(default=0)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # Adjusted field type

    def calculatePercentage(self):
        expenses = BaseTransaction.objects.filter(type="Expense")
        categories = Category.objects.all()

        total_expenses = expenses.count()

        if total_expenses > 0:
            for category in categories:
                category_count = expenses.filter(category=category).count()
                category.count = category_count
                category.percentage = (category_count / total_expenses) * 100
                category.save()
        else:
            for category in categories:
                category.count = 0
                category.percentage = 0
                category.save()        

    def clean(self):
        super.clean()
        if self.percentage > 100:
            raise ValidationError("Percentage must be less than or equal to 100.")
        
    def save(self, *args, **kwargs):
        self.user_username = self.user.username  # Automatically populate the username field
        super().save(*args, **kwargs)

    def __str__(self): 
        return f"{self.id} - {self.name} - #{self.colour}"

def generate_transaction_id():
    length = 8

    while True:
        code = ''.join(random.choices(string.hexdigits, k=length))
        if BaseTransaction.objects.filter(transaction_id=code).count() == 0:
            break

    return code

class Budget(models.Model):
    name = models.CharField(max_length=50)
    amount_allocated = models.DecimalField(max_digits=10, decimal_places=2)
    amount_left = models.DecimalField(max_digits=10, decimal_places=2, default="0.00")
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="budget_owner")
    user_username = models.CharField(max_length=150, editable=False, default="")
    @property
    def status(self):
        if self.start_date > timezone.now().date():
            return "Inactive"
        else:
            return "Active"
    
    def calculate_amount_left(self):
        """
        Calculate the remaining amount based on linked transactions.
        """
        linked_transactions = self.transactions.all()
        totals = linked_transactions.aggregate(
            total_expenses=models.Sum('amount', filter=models.Q(type="Expense")),
            total_incomes=models.Sum('amount', filter=models.Q(type="Income"))
        )
        total_expenses = totals['total_expenses'] or 0
        total_incomes = totals['total_incomes'] or 0

        # Calculate amount left
        self.amount_left = self.amount_allocated - total_expenses + total_incomes
        return self.amount_left

    def save(self, *args, **kwargs):
        self.user_username = self.user.username  # Automatically populate the username field
        if not self.end_date:
            self.end_date = self.start_date + datetime.timedelta(days=30)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - ${self.amount_allocated}"


class BaseTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("Expense", "Expense"),
        ("Income", "Income"),
    ]

    transaction_id = models.CharField(max_length=8, default=generate_transaction_id, primary_key=True)
    # amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(decimal_places=2, max_digits=15)
    date_created = models.DateField(default=datetime.date.today)
    type = models.CharField(max_length=50, choices=TRANSACTION_TYPES, default="Expense", null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="expense_category", null=True, blank=True)
    category_name = models.CharField(max_length=150, editable=False, default="")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transaction_owner")
    user_username = models.CharField(max_length=150, editable=False, default="")
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="transactions", null=True, blank=True)
    budget_name = models.CharField(max_length=150, editable=False, default="")

    def clean(self):
        if self.type != "Expense" and self.category is not None:
            raise ValidationError("Category can only be specified for transactions of type 'Expense'.")

    def save(self, *args, **kwargs):
        self.user_username = self.user.username  # Automatically populate the username field
        if self.category is not None:
            self.category_name = self.category.name  # Automatically populate the category_name field
        if self.budget is not None:
            self.budget_name = self.budget.name  # Automatically populate the budget_name field
        # We will then recalculate the amount left whenever a transaction is added
        # (if linked to a budget)
        if self.budget:
            if self.budget.transactions:
                self.budget.calculate_amount_left()
            self.budget.save()
        super().save(*args, **kwargs)

        if self.type == 'Expense':
            Category.calculatePercentage(Category)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        if self.type == 'Expense':
            Category.calculatePercentage(Category)

    def __str__(self):
        return f"{self.transaction_id} - {self.type} - ${self.amount}"


    


