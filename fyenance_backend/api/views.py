import os
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
import requests
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
import json
from .models import BaseTransaction, Budget, Category
from .serializers import TransactionSerializer, BudgetSerializer, CategorySerializer

# Do not forget to add the login required decorator here
class TransactionListCreate(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        transaction_id = self.request.data.get('transaction_id')
        print(transaction_id)
        return BaseTransaction.objects.filter(transaction_id=transaction_id)
    
    def post(self, request, format=None):
        """
        This POST request should allow me to add a new transaction or update an existing one.
        So it first checks if the serializer is valid.
        If it is, it saves the newly filled fields.

        If the transaction ID exists, it updates the existing transaction with new data.
        If the transaction ID does not exist, it creates a new transaction.
        """

        serializer = self.serializer_class(data=request.data)
        print(serializer)
        if serializer.is_valid():
            amount = serializer.validated_data.get('amount')
            # date_created = serializer.data.get('date_created')
            type = serializer.validated_data.get('type')
            category = serializer.validated_data.get('category')
            user = request.user
            queryset = self.get_queryset()

            if queryset.exists():
                transaction = queryset[0]
                transaction.amount = amount
                transaction.type = type
                transaction.category = category
                transaction.save(update_fields=['amount', 'date_created', 'type', 'category'])
                return Response(self.serializer_class(transaction).data, status=status.HTTP_200_OK) # I am choosing not to call it TransactionSerializer
            else:
                """
                If the transaction id does not exist, it creates a new transaction.
                """
                transaction = serializer.save(user=user)
                return Response(self.serializer_class(transaction).data, status=status.HTTP_201_CREATED)
        return Response({"Bad Request": "Invalido data"}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, format=None):
        """
        This GET request lists all saved transactions.
        """
        
        user = request.user
        if user != None:
            transactions = BaseTransaction.objects.filter(user=user)
            data = TransactionSerializer(transactions, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response({"Bad Request": "User parameter not found in request."}, status=status.HTTP_400_BAD_REQUEST)
    
class BudgetListCreate(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        budget_name = self.request.data.get('name')
        return Budget.objects.filter(name=budget_name)
    
    def post(self, request, format=None):
        """
        This POST request should allow me to add a new transaction or update an existing one.
        So it first checks if the serializer is valid.
        If it is, it saves the newly filled fields.

        If the transaction ID exists, it updates the existing transaction with new data.
        If the transaction ID does not exist, it creates a new transaction.
        """

        serializer = self.serializer_class(data=request.data)
        print(serializer)
        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            amount_allocated = serializer.validated_data.get('amount_allocated')
            amount_left = serializer.validated_data.get('amount_left')
            user = request.user
            queryset = self.get_queryset()

            if queryset.exists():
                budget = queryset[0]
                budget.name = name
                budget.amount_allocated = amount_allocated
                budget.amount_left = amount_left
                budget.user = user
                budget.save(update_fields=['name', 'amount_allocated', 'amount_left', 'user'])
                return Response(self.serializer_class(budget).data, status=status.HTTP_200_OK) # I am choosing not to call it TransactionSerializer
            else:
                """
                If the transaction id does not exist, it creates a new transaction.
                """
                budget = serializer.save(user=user)
                return Response(self.serializer_class(budget).data, status=status.HTTP_201_CREATED)
        return Response({"Bad Request": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, format=None):
        """
        This GET request lists all saved budgets.
        """

        username = request.user.username
        if username != None:
            budget = Budget.objects.filter(user_username=username)
            data = BudgetSerializer(budget, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response({"Bad Request": "User parameter not found in request."}, status=status.HTTP_400_BAD_REQUEST)


class CategoryListCreate(generics.CreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny] # After testing these endpoints, the permission classes will return to IsAuthenticated
    lookup_url_kwarg = 'name'

    def get_queryset(self):
        name = self.request.data.get('name')
        return Category.objects.filter(name=name)
    
    def post(self, request, format=None):
        """
        This POST request should allow me to add a new category or update an existing one.
        So it first checks if the serializer is valid.
        If it is, it saves the newly filled fields.

        If the category name exists, it updates the existing category colour with new data.
        If the category name does not exist, it creates a new category.
        """

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            colour = serializer.data.get('colour')
            if colour[0] != '#':
                colour = '#' + colour
            queryset = self.get_queryset()

            if queryset.exists():
                category = queryset[0]
                category.colour = colour
                category.save(update_fields=['colour'])
                return Response(self.serializer_class(category).data, status=status.HTTP_200_OK) # I am choosing not to call it CategorySerializer
            else:
                """
                If the category name does not exist, it creates a new category.
                """

                category = Category(name=name, colour=colour)
                category.save()
                return Response(self.serializer_class(category).data, status=status.HTTP_201_CREATED)
        return Response({"Bad Request": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, format=None):
        """
        This POST request should allow me to add a new transaction or update an existing one.
        So it first checks if the serializer is valid.
        If it is, it saves the newly filled fields.

        If the transaction ID exists, it updates the existing transaction with new data.
        If the transaction ID does not exist, it creates a new transaction.
        """

        categories = Category.objects.all()
        data = CategorySerializer(categories, many=True).data
        # data['logged_in'] = self.request.session.session_key == transactions[0].user
        return Response(data, status=status.HTTP_200_OK)


class ExchangeTokenView(APIView):
    permission_classes = [IsAuthenticated] # After testing these endpoints, the permission classes will return to IsAuthenticated
    def post(self, request):
        code = request.data.get("code")
        if not code:
            return Response({"error": "Code is required"}, status=400)

        url = "https://api.withmono.com/account/auth"
        headers = {"mono-sec-key": os.getenv("MONO_SECRET_KEY")}  # Replace with your actual secret key
        response = requests.post(url, headers=headers, json={"code": code})

        if response.status_code == 200:
            data = response.json()
            account_id = data.get("id")
            account_balance = data.get("balance")
            # Save account_id to the database (optional)
            user = request.user  # Retrieve the currently logged-in user
            user.account_id = account_id
            user.account_balance = account_balance
            user.save()
            return Response({
                "account_id": account_id,
                "account_balance": account_balance,
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(response.json(), status=response.status_code)


class AboutView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        return HttpResponse("This is the about page.", content_type="text/plain")

