from .models import BaseTransaction, Budget, Category
from rest_framework import serializers
from decimal import Decimal

def cleanDecimal(value):
    return float(value.replace(",", ""))

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'colour', 'percentage')
        extra_kwargs = {'id': {'read_only': True}, 'percentage': {'read_only': True}}

class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    class Meta:
        model = BaseTransaction
        fields = ('transaction_id', 'amount', 'type', 'category', 'budget', 'user_username', 'category_name', 'budget_name', 'date_created')
        extra_kwargs = {'user_username': {'read_only': True}, 'category_name': {'read_only': True}, 'budget_name': {'read_only': True}}
    
    def to_internal_value(self, data):
        if 'amount' in data:
            if isinstance(data['amount'], str):
                try:
                    data['amount'] = cleanDecimal(data['amount'])
                except ValueError as e:
                    raise serializers.ValidationError({'amount': str(e)})
            else:
                data['amount'] = Decimal(data['amount'])
        
        if 'category' in data:
            if isinstance(data['category'], str):
                if data['category'].strip():
                    data['category'] = int(data['category'])
                else:
                    data['category'] = None
    
        return super().to_internal_value(data)


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ('id', 'name', 'amount_allocated', 'amount_left', 'user_username', 'status', 'start_date', 'end_date')
        extra_kwargs = {'id': {'read_only': True}, 'user_username': {'read_only': True}, 'status': {'read_only': True}}
    
    def to_internal_value(self, data):
            if 'amount_allocated' in data:
                if isinstance(data['amount_allocated'],str):
                    try:
                        data['amount_allocated'] = cleanDecimal(data['amount_allocated'])
                    except ValueError as e:
                        raise serializers.ValidationError({'amount_allocated': str(e)})
                else:
                    data['amount_allocated'] = Decimal(data['amount_allocated'])
            if 'amount_left' in data:
                if isinstance(data['amount_left'], str):
                    try:
                        data['amount_left'] = cleanDecimal(data['amount_left'])
                    except ValueError as e:
                        raise serializers.ValidationError({'amount_left': str(e)})
            return super().to_internal_value(data)

