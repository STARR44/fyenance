from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.password_validation import validate_password, password_validators_help_text_html
from .models import FyenanceUser
from django.utils.text import capfirst

class SignUpForm(UserCreationForm):
    username = forms.CharField(label='Username', widget=forms.TextInput,max_length=30, required=True)
    email = forms.EmailField(label='Email address', widget= forms.EmailInput, required=True)
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput, required=True)
    password2 = forms.CharField(label='Confirm password', widget=forms.PasswordInput, required=True)

    class Meta:
        model = FyenanceUser
        fields = ['username', 'email', 'password1', 'password2']

class LoginForm(AuthenticationForm):
    username = forms.CharField(label='Username', widget=forms.TextInput, max_length=30, required=True)
    password = forms.CharField(label='Password', widget=forms.PasswordInput, required=True)
    error_messages = {
        'invalid_login': "Please enter a correct %(username)s and password. Note that both fields may be case-sensitive.",
        'inactive': "This account is inactive.",
    }
    
    
        
