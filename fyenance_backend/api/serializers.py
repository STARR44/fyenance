from .models import BaseTransaction, Budget, Category
from rest_framework import serializers


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseTransaction
        fields = ('transaction_id', 'amount', 'type', 'category', 'user')
        extra_kwargs = {'user': {'read_only': True}}

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ('name', 'amount_allocated', 'amount_left', 'user')
        extra_kwargs = {'user': {'read_only': True}}

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'colour')