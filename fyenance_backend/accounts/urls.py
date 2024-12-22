from django.urls import path
# from .views import CreateUserView
from .views import SignUpView, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('sign-up', SignUpView.as_view(), name='sign_up'),
    # path('sign-up', CreateUserView.as_view(), name='sign_up'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
]