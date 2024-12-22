import os
from django.shortcuts import render, redirect
from django.contrib.auth import login
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import FyenanceUser
# from .serializers import UserSerializer
from .forms import SignUpForm, LoginForm

from django.views.generic.edit import CreateView, FormView
from django.urls import reverse_lazy

# class CreateUserView(generics.CreateAPIView):
#     queryset = FyenanceUser.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]

# class SignUpView(generics.CreateAPIView):
class SignUpView(CreateView):
    model = FyenanceUser
    permission_classes = [AllowAny]
    form_class = SignUpForm
    template_name = 'sign_up.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        # Save the new user to the database
        response = super().form_valid(form)
        return redirect(self.success_url)

    def form_invalid(self, form):
        # Return a response for invalid form submission
        return self.render_to_response(self.get_context_data(form=form))

class LoginView(FormView):
    permission_classes = [AllowAny]
    form_class = LoginForm
    template_name = 'login.html'
    success_url = reverse_lazy('get_token')  # Redirect to the token page after successful login

    def form_valid(self, form):
        # Authenticate and log in the user
        user = form.get_user()
        if user:
            login(self.request, user)  # Log the user in
            return redirect(self.success_url)
        return self.form_invalid(form)

    def form_invalid(self, form):
        # Return a 401 response for invalid login attempts
        return self.render_to_response(self.get_context_data(form=form), status=401)