from django.urls import path
from .views import SignUpAPIView, GoogleLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

app_name = 'accounts'

urlpatterns = [
    path('signup', SignUpAPIView.as_view(), name='sign_up'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
]