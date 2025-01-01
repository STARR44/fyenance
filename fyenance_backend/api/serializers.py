from .models import BaseTransaction, Budget, Category
from rest_framework import serializers


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FyenanceUser
#         fields = ('id', 'username', 'password')
#         extra_kwargs = { 'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = FyenanceUser.objects.create_user(**validated_data)
#         return user

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseTransaction
        fields = ('transaction_id', 'amount', 'type', 'category', 'user')
        # extra_kwargs = {'transaction_id': {'read_only': True}, 'user': {'read_only': True}}
        extra_kwargs = {'user': {'read_only': True}}

    # def create(self, validated_data):
    #     transaction = BaseTransaction.objects.create_transaction(**validated_data)
    #     return transaction

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ('name', 'amount_allocated', 'amount_left', 'user')
        # fields = ('name', 'amount_allocated', 'amount_left', 'user')
        extra_kwargs = {'user': {'read_only': True}}

    # def create(self, validated_data):
    #     budget = Budget.objects.create_budget(**validated_data)
        # return budget

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'colour')

    # def create(self, validated_data):
    #     category = Category.objects.create_budget(**validated_data)
    #     return category