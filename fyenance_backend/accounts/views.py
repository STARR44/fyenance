import os
from django.shortcuts import render, redirect
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import FyenanceUser
from .serializers import UserSerializer
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import login, authenticate
from django.contrib.auth.views import LoginView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse_lazy
from .utils import verify_google_token
from .forms import SignUpForm, LoginForm

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import FyenanceUser

class SignUpAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if FyenanceUser.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if FyenanceUser.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters'}, status=status.HTTP_400_BAD_REQUEST)

        user = FyenanceUser.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'User created successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    """
    Handles user login through a form and returns JWT tokens upon successful authentication.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """
        Render the login page with the form.
        """
        form = LoginForm()
        return render(request, 'login.html', {'form': form})

    def post(self, request, *args, **kwargs):
        """
        Process the login form and return JWT tokens upon successful login.
        """
        form = LoginForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')

            user = authenticate(username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                return Response({
                    'refresh': refresh_token,
                    'access': access_token,
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)

        return Response({
            'error': 'Invalid credentials or form data',
            'form_errors': form.errors
        }, status=status.HTTP_400_BAD_REQUEST)


def get_one_name(user_data, index):
    if not isinstance(user_data, dict):
        return None

    name = user_data.get('name', '').strip()
    if not name:
        return None

    name_parts = name.split()
    try:
        return name_parts[index]
    except IndexError:
        return None

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        user_data = verify_google_token(token)
        if not user_data:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

        google_id = user_data['google_id']
        email = user_data['email']
        first_name = get_one_name(user_data, 0)
        last_name = get_one_name(user_data, -1)
        google_username = user_data.get('username')

        user, created = FyenanceUser.objects.get_or_create(
            username=google_username or google_id,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'is_google_user': True,
                'google_id': google_id
            }
        )

        if created:
            user.set_unusable_password()
            user.save()

        login(request, user)
        return Response({'message': 'Login successful', 'username': user.username}, status=status.HTTP_200_OK)