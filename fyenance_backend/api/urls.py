from django.urls import path
from .views import TransactionListCreate, BudgetListCreate, CategoryListCreate, AboutView, ExchangeTokenView

app_name = 'api'

urlpatterns = [
    path('transactions/', TransactionListCreate.as_view(), name='transactions'),
    # path('transactions/new', TransactionListCreate.as_view(), name='new-transaction'),
    path('budgets/', BudgetListCreate.as_view(), name='budgets'),
    # path('budgets/new', BudgetListCreate.as_view(), name='new-budget'),
    path('categories/', CategoryListCreate.as_view(), name='categories'),
    path("exchange-token/", ExchangeTokenView.as_view(), name="exchange-token"),
    # path('categories/new', CategoryListCreate.as_view(), name='new-category'),
    path('about/', AboutView.as_view(), name='about'),
]