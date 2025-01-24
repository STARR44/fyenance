from .models import FyenanceUser
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FyenanceUser
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = { 'password': {'write_only': True}}

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['account_balance'] = user.account_balance
        # ...

        return token