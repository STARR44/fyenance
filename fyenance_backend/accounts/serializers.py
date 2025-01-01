from .models import FyenanceUser
from rest_framework import serializers


# class UserSerializer(serializers.ModelSerializer):
#     confirm_password = serializers.CharField(write_only=True)

#     class Meta:
#         model = FyenanceUser
#         fields = ('id', 'username', 'email', 'password', 'confirm_password')
#         extra_kwargs = { 'password': {'write_only': True}}

#     def validate_password(self, data):
#         if data['password']!= data['confirm_password']:
#             raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
#         return data

#     def create(self, validated_data):
#         validated_data.pop('confirm_password')
#         user = FyenanceUser.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FyenanceUser
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = { 'password': {'write_only': True}}

    # def create(self, validated_data):
    #     user = FyenanceUser.objects.create_user(**validated_data)
    #     return user