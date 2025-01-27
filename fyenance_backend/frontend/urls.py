from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index),
    path('transactions/', index),
    path('budgets/', index),
    path('settings/', index),
    path('dashboard/', index),
    path('about/', index),
    path('signup/', index),
    path('login/', index),
]
