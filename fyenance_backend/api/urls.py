from django.urls import path
from .views import TransactionListCreate, BudgetListCreate, CategoryListCreate, AboutView

urlpatterns = [
    path('transactions/', TransactionListCreate.as_view(), name='transactions'),
    path('budgets/', BudgetListCreate.as_view(), name='budgets'),
    path('categories/', CategoryListCreate.as_view(), name='categories'),
    path('about/', AboutView.as_view(), name='about'),
]