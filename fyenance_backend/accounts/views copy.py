import os

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
import json
from accounts.serializers import UserSerializer
from accounts.models import FyenanceUser


class UserCreate(generics.CreateAPIView):
    queryset = FyenanceUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class SignUpView(generics.CreateAPIView):
    queryset = FyenanceUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Check if the request includes Google credentials
        google_token = request.data.get('google_credential')
        if google_token:
            try:
                user_data = id_token.verify_oauth2_token(
                    google_token, requests.Request(), os.environ['GOOGLE_OAUTH_CLIENT_ID']
                )
                email = user_data.get('email')
                first_name = user_data.get('given_name')
                last_name = user_data.get('family_name')

                # Get or create user
                user, created = FyenanceUser.objects.get_or_create(
                    email=email,
                    defaults={
                        'username': email.split('@')[0],
                        'first_name': first_name,
                        'last_name': last_name,
                    }
                )
                if created:
                    return JsonResponse({'message': 'User registered successfully via Google.'}, status=201)
                else:
                    return JsonResponse({'message': 'User already exists. Please log in.'}, status=200)

            except ValueError:
                return JsonResponse({'error': 'Invalid Google token.'}, status=400)
        else:
            # Handle manual sign-up using DRF's CreateAPIView
            return super().post(request, *args, **kwargs)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        google_token = request.data.get('google_credential')
        if google_token:
            try:
                user_data = id_token.verify_oauth2_token(
                    google_token, requests.Request(), os.environ['GOOGLE_OAUTH_CLIENT_ID']
                )
                email = user_data.get('email')
                user = FyenanceUser.objects.filter(email=email).first()

                if user:
                    return Response({'message': 'Login successful with Google.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'User not found. Please sign up.'}, status=status.HTTP_404_NOT_FOUND)

            except ValueError:
                return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Regular login with username/email and password
            username_or_email = request.data.get('username_or_email')
            password = request.data.get('password')

            user = authenticate(
                username=username_or_email, password=password
            ) or authenticate(email=username_or_email, password=password)

            if user:
                return Response({'message': 'Login successful.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)    

@csrf_exempt
def google_sign_up(request):
    return render(request, 'sign_up.html')


@csrf_exempt
def auth_receiver(request):
    """
    Google calls this URL after the user has signed in with their Google account.
    """
    print('Inside')
    token = request.POST['credential']
    if not token:
        return HttpResponse('Missing credential', status=400)

    try:
        user_data = id_token.verify_oauth2_token(
            token, requests.Request(), os.environ['GOOGLE_OAUTH_CLIENT_ID']
        )
        email = user_data.get('email')
        first_name = user_data.get('given_name')
        last_name = user_data.get('family_name')

        user, created = FyenanceUser.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'username': email.split('@')[0],
            }
        )
    except ValueError:
        return HttpResponse('Invalid Google Token', status=403)

    # Extract user details from the Google token
    


    return redirect('home')


def sign_out(request):
    del request.session['user_data']
    return redirect('sign_in')