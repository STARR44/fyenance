from .models import FyenanceUser
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FyenanceUser
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = { 'password': {'write_only': True}}