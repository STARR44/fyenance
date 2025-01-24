from .models import BaseTransaction, Budget, Category
from rest_framework import serializers

def cleanDecimal(value):
    return float(value.replace(",", ""))

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'colour', 'percentage')
        extra_kwargs = {'percentage': {'read_only': True}}

class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    class Meta:
        model = BaseTransaction
        fields = ('transaction_id', 'amount', 'type', 'category', 'budget', 'user_username', 'category_name', 'budget_name', 'date_created')
        extra_kwargs = {'user_username': {'read_only': True}, 'category_name': {'read_only': True}, 'budget_name': {'read_only': True}}
    
    def to_internal_value(self, data):
            # Clean amount_allocated and amount_left here
            if 'amount' in data:
                data['amount'] = cleanDecimal(data['amount'])
            return super().to_internal_value(data)


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ('name', 'amount_allocated', 'amount_left', 'user_username')
        extra_kwargs = {'user_username': {'read_only': True}}
    
    def to_internal_value(self, data):
            # Clean amount_allocated and amount_left here
            if 'amount_allocated' in data:
                data['amount_allocated'] = cleanDecimal(data['amount_allocated'])
            if 'amount_left' in data:
                data['amount_left'] = cleanDecimal(data['amount_left'])
            return super().to_internal_value(data)

