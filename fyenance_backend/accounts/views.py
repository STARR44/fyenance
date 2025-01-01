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
from django.views.generic.edit import CreateView, FormView
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse_lazy
from .utils import verify_google_token
from .forms import SignUpForm, LoginForm

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator



# class CreateUserView(generics.CreateAPIView):
#     queryset = FyenanceUser.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]

class SignUpView(CreateView):
    model = FyenanceUser
    permission_classes = [AllowAny]
    form_class = SignUpForm
    template_name = 'sign_up.html'
    # success_url = reverse_lazy('login')

    def get_success_url(self):
        return reverse_lazy('accounts:login')

    def form_valid(self, form):
        # TODO: Optimize this, Implement email verification
        return super().form_valid(form)

    def form_invalid(self, form):
        # Return a response for invalid form submission
        return self.render_to_response(self.get_context_data(form=form))

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

            # Authenticate user
            user = authenticate(username=username, password=password)
            if user:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                # Respond with tokens and user data
                return Response({
                    'refresh': refresh_token,
                    'access': access_token,
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)

        # Invalid form or credentials
        return Response({
            'error': 'Invalid credentials or form data',
            'form_errors': form.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# class LoginView(FormView):
# class UserLoginView(LoginView):
#     # redirect_authenticated_user = True
#     permission_classes = [AllowAny]
#     # form_class = LoginForm
#     template_name = 'login.html'
#     # success_url = reverse_lazy('get_token')  # Redirect to the token page after successful login

#     def get_success_url(self):
#         return reverse_lazy('api:transactions')

#     def form_valid(self, form):
#         # Authenticate and log in the user
#         user = form.get_user()
#         if user:
#             # login(self.request, user)  # Log the user in
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#                 'user': UserSerializer(user).data
#             })
#         return self.form_invalid(form)

#     def form_invalid(self, form):
#         # Return a 401 response for invalid login attempts
#         return self.render_to_response(self.get_context_data(form=form), status=status.HTTP_401_UNAUTHORIZED)

def get_one_name(user_data, index):
    if not isinstance(user_data, dict):  # Ensure user_data is a dictionary
        return None

    name = user_data.get('name', '').strip()  # Extract and strip the name
    if not name:  # If name is empty or only whitespace
        return None

    name_parts = name.split()
    try:
        return name_parts[index]  # Return the requested part by index
    except IndexError:  # Handle cases where index is out of bounds
        return None

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')  # Token from Google
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

        # Check if the user already exists
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
            user.set_unusable_password()  # Google users won't have a password
            user.save()

        login(request, user)  # Log in the user
        return Response({'message': 'Login successful', 'username': user.username}, status=status.HTTP_200_OK)