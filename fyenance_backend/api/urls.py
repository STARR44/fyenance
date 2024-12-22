from django.urls import path
from .views import TransactionCreate, TransactionList, BudgetCreate, BudgetList, CategoryCreate, CategoryList, AboutView

urlpatterns = [
    path('transactions/new', TransactionCreate.as_view(), name='trx_new'),
    path('transactions/', TransactionList.as_view(), name='trx_list'),
    path('budgets/new', BudgetCreate.as_view(), name='budget_new'),
    path('budgets/', BudgetList.as_view(), name='budget_list'),
    path('category/new', CategoryCreate.as_view(), name='category_new'),
    path('category/', CategoryList.as_view(), name='category_list'),
    path('about/', AboutView.as_view(), name='about'),
]