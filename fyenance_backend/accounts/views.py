import os
from django.shortcuts import render, redirect
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import FyenanceUser
from .serializers import UserSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = FyenanceUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]