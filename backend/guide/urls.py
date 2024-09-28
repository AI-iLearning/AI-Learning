from django.urls import path
from .views import send_chat
from .views import get_chat_messages


urlpatterns = [
    path('send/', send_chat, name='send_chat'),
    path('message/', get_chat_messages, name='get_chat_messages'),
]
