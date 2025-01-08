"""
views.py

This module contains views for managing transactions, budgets, categories, and user interactions with an external API. 
It also includes utility views such as an about page and token exchange endpoint. These views use Django REST Framework 
(DRF) and other Django tools to implement functionality for creating, retrieving, and updating resources.

The main classes include:
- TransactionListCreate: Manage user transactions.
- BudgetListCreate: Manage user budgets.
- CategoryListCreate: Manage categories.
- ExchangeTokenView: Handle token exchange with an external API.
- AboutView: Provide a simple about page.
"""

import os, re
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
from django.core.exceptions import ValidationError

def cleanDecimal(value):
    return float(value.replace(",", ""))

# Do not forget to add the login required decorator here
class TransactionListCreate(generics.ListCreateAPIView):
    
     
    """
    Handles listing and creating user transactions.

    **GET**:
    - Lists all transactions associated with the authenticated user.

    **POST**:
    - Creates a new transaction or updates an existing one based on `transaction_id`.

    Attributes:
        serializer_class (TransactionSerializer): The serializer for handling transaction data.
        permission_classes (list): Restricts access to authenticated users.

    Methods:
        get_queryset: Returns transactions filtered by `transaction_id` if provided.
        post: Handles the creation or update of a transaction.
        get: Retrieves all transactions for the authenticated user.
    """

    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Get transactions filtered by transaction ID from the request data.

        Returns:
            QuerySet: A queryset of transactions matching the given transaction ID.
        """

        transaction_id = self.request.data.get('transaction_id')
        print(transaction_id)
        return BaseTransaction.objects.filter(transaction_id=transaction_id)
    
    def post(self, request, format=None):
        """
        Handles the creation or update of a transaction.

        Parameters:
        - request: The HTTP request containing transaction data.
        - format: Optional format specifier.

        Workflow:
        - If a transaction with the provided ID exists, updates it with new data.
        - If no transaction exists, creates a new transaction.

        Returns:
        - 200 OK: When an existing transaction is updated.
        - 201 Created: When a new transaction is created.
        - 400 Bad Request: If the request data is invalid.

        Example:
        This POST request should allow me to add a new transaction or update an existing one.
        So it first checks if the serializer is valid.
        If it is, it saves the newly filled fields.

        If the transaction ID exists, it updates the existing transaction with new data.
        If the transaction ID does not exist, it creates a new transaction.
        """

        serializer = self.serializer_class(data=request.data)
        print(serializer)
        if serializer.is_valid():
            try:
                amount = serializer.validated_data.get('amount')
                type = serializer.validated_data.get('type')
                category = serializer.validated_data.get('category')
                budget = serializer.validated_data.get('budget')
                user = request.user
                queryset = self.get_queryset()

                if queryset.exists():
                    transaction = queryset[0]
                    transaction.amount = amount
                    transaction.type = type
                    transaction.category = category
                    transaction.budget = budget
                    transaction.save(update_fields=['amount', 'date_created', 'type', 'category', 'budget'])
                    return Response(self.serializer_class(transaction).data, status=status.HTTP_200_OK) # I am choosing not to call it TransactionSerializer
                else:
                    """
                    If the transaction id does not exist, it creates a new transaction.
                    """
                    transaction = serializer.save(user=user)
                    return Response(self.serializer_class(transaction).data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({"Error (Bad Request)": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Bad Request": "Invalido data"}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, format=None):
        """
        Lists all transactions for the authenticated user.

        Parameters:
        - request: The HTTP request.
        - format: Optional format specifier.

        Workflow:
        - Retrieves and returns all transactions for the authenticated user.

        Returns:
        - 200 OK: When transactions are successfully listed.
        - 400 Bad Request: If the user parameter is missing in the request.
        """
        
        user = request.user
        if user != None:
            transactions = BaseTransaction.objects.filter(user=user)
            data = TransactionSerializer(transactions, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response({"Bad Request": "User parameter not found in request."}, status=status.HTTP_400_BAD_REQUEST)
    
class BudgetListCreate(generics.ListCreateAPIView):
    """
    Handles listing and creating user budgets.

    **GET**:
    - Lists all budgets associated with the authenticated user.

    **POST**:
    - Creates a new budget or updates an existing one based on `name`.

    Attributes:
        serializer_class (BudgetSerializer): The serializer for handling budget data.
        permission_classes (list): Restricts access to authenticated users.

    Methods:
        get_queryset: Returns budgets filtered by `name`.
        post: Handles the creation or update of a budget.
        get: Retrieves all budgets for the authenticated user.
    """

    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Returns queryset filtered by `name`."""

        budget_name = self.request.data.get('name')
        return Budget.objects.filter(name=budget_name)
    
    def post(self, request, format=None):
        """
        Handles the creation or update of a budget.

        Parameters:
        - request: The HTTP request containing budget data.
        - format: Optional format specifier.

        Workflow:
        - If a budget with the provided name exists, updates it with new data.
        - If no budget exists, creates a new budget.

        Returns:
        - 200 OK: When an existing budget is updated.
        - 201 Created: When a new budget is created.
        - 400 Bad Request: If the request data is invalid.

        Example:
        This POST request should allow me to add a new transaction or update an existing one.
        So it first checks if the serializer is valid.
        If it is, it saves the newly filled fields.

        If the transaction ID exists, it updates the existing transaction with new data.
        If the transaction ID does not exist, it creates a new transaction.
        """

        serializer = self.serializer_class(data=request.data)
        print(serializer)

        if serializer.is_valid(raise_exception=True):
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
                If the budget name does not exist, it creates a new budget.
                """
                # I am doing this to set the remaining amount as the allocated amount for new budgets
                amount_left = serializer.validated_data.get('amount_allocated')
                budget = serializer.save(amount_left=amount_left, user=user)
                return Response(self.serializer_class(budget).data, status=status.HTTP_201_CREATED)
        return Response({"Bad Request": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, format=None):
        """
        Lists all budgets for the authenticated user.

        Parameters:
        - request: The HTTP request.
        - format: Optional format specifier.

        Workflow:
        - Retrieves and returns all budgets for the authenticated user.

        Returns:
        - 200 OK: When budgets are successfully listed.
        - 400 Bad Request: If the user parameter is missing in the request.

        Example:
        This GET request lists all saved budgets.
        """

        username = request.user.username
        if username != None:
            budget = Budget.objects.filter(user_username=username)
            data = BudgetSerializer(budget, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response({"Bad Request": "User parameter not found in request."}, status=status.HTTP_400_BAD_REQUEST)


class CategoryListCreate(generics.CreateAPIView):
    """
    Handles creation and listing of categories.

    Attributes:
        serializer_class (CategorySerializer): The serializer for handling category data.
        permission_classes (list): Configured to allow any user for now.
        lookup_url_kwarg (str): Lookup field for category name.

    Methods:
        get_queryset: Returns queryset filtered by `name`.
        post: Handles the creation or update of a category.
        get: Retrieves all categories.
    """

    serializer_class = CategorySerializer
    permission_classes = [AllowAny] # After testing these endpoints, the permission classes will return to IsAuthenticated
    lookup_url_kwarg = 'name' # Find out if this is still necessary

    def get_queryset(self):
        """Returns queryset filtered by `name`."""

        name = self.request.data.get('name')
        return Category.objects.filter(name=name)
    
    def post(self, request, format=None):
        """
        Handles the creation or update of a category.

        Parameters:
        - request: The HTTP request containing category data.
        - format: Optional format specifier.

        Workflow:
        - If a category with the provided name exists, updates it with new data.
        - If no category exists, creates a new category.

        Returns:
        - 200 OK: When an existing category is updated.
        - 201 Created: When a new category is created.
        - 400 Bad Request: If the request data is invalid.

        Example:
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
            # Checking whether the colour provided is valid HEX
            pattern = r'(?#)([a-fA-F0-9]{6})'
            if not re.match(pattern, colour):
                return Response({"Error": "Invalid colour provided."}, status=status.HTTP_400_BAD_REQUEST)

            if colour[0] != '#':
                colour = '#' + colour
            queryset = self.get_queryset()

            if queryset.exists():
                category = queryset[0]
                category.colour = colour.lower()
                print(category.colour)
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
        Lists all categories.

        Parameters:
        - request: The HTTP request.
        - format: Optional format specifier.

        Workflow:
        - Retrieves and returns all categories.

        Returns:
        - 200 OK: When categories are successfully listed.

        Example:
        This POST request should allow me to add a new transaction or update an existing one.
        So it first checks if the serializer is valid.
        If it is, it saves the newly filled fields.

        If the transaction ID exists, it updates the existing transaction with new data.
        If the transaction ID does not exist, it creates a new transaction.
        """

        categories = Category.objects.all()
        data = CategorySerializer(categories, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class ExchangeTokenView(APIView):
    """
    Handles token exchange with an external API.

    Attributes:
        permission_classes (list): Restricts access to authenticated users.

    Methods:
        post: Exchanges a code for account information.
    """
     
    permission_classes = [IsAuthenticated] # After testing these endpoints, the permission classes will return to IsAuthenticated
    
    def post(self, request):
        """
        Exchanges a Mono API code for an account ID and balance.

        Parameters:
        - request: The HTTP request containing the Mono API code.

        Workflow:
        - Validates the presence of the Mono API code in the request.
        - Sends the code to the Mono API to retrieve account details.
        - Saves the account ID and balance for the current user.

        Returns:
        - 201 Created: When the account details are saved successfully.
        - 400 Bad Request: If the Mono API code is missing.
        - Other Status Codes: Reflect the response from the Mono API.
        """

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
    """
    Returns a plain text response with information about the application.

    Parameters:
    - request: The HTTP request for the about page.

    Workflow:
    - Sends a static text response detailing the application's purpose.

    Returns:
    - 200 OK: Always, with a plain text response.
    """

    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        return HttpResponse("This is the about page.", content_type="text/plain")

