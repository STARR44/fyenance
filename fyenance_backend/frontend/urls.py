from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index),
    path('transactions/', index),
    path('categories/', index),
    path('budgets/', index),
    path('settings/', index),
    path('dashboard/', index),
]
