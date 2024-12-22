import os
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
import json
from .models import BaseTransaction, Budget, Category
from .serializers import TransactionSerializer, BudgetSerializer, CategorySerializer
# from accounts.serializers import UserSerializer
# from accounts.models import FyenanceUser

class TransactionCreate(generics.CreateAPIView):
    queryset = BaseTransaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

class TransactionList(generics.ListAPIView):
    queryset = BaseTransaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return BaseTransaction.objects.filter(user=user)

class BudgetCreate(generics.CreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [AllowAny]

class BudgetList(generics.ListAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Budget.objects.filter(user=user)

class CategoryCreate(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class CategoryList(generics.ListAPIView):
    queryset = Budget.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

class AboutView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        return HttpResponse("This is the about page.", content_type="text/plain")


# class UserCreate(generics.CreateAPIView):
#     queryset = FyenanceUser.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]

# @csrf_exempt
# def sign_in(request):
#     return render(request, 'sign_in.html')


# @csrf_exempt
# def auth_receiver(request):
#     """
#     Google calls this URL after the user has signed in with their Google account.
#     """
#     print('Inside')
#     token = request.POST['credential']

#     try:
#         user_data = id_token.verify_oauth2_token(
#             token, requests.Request(), os.environ['GOOGLE_OAUTH_CLIENT_ID']
#         )
#     except ValueError:
#         return HttpResponse(status=403)

#     # In a real app, I'd also save any new user here to the database.
#     # You could also authenticate the user here using the details from Google (https://docs.djangoproject.com/en/4.2/topics/auth/default/#how-to-log-a-user-in)
#     request.session['user_data'] = user_data

#     return redirect('sign_in')


# def sign_out(request):
#     del request.session['user_data']
#     return redirect('sign_in')

