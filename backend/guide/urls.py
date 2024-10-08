from django.urls import path
from .views import SendChatView, GetChatMessagesView,SelectGuideView

urlpatterns = [
    path('send/', SendChatView.as_view(), name='send_chat'),
    path('message/', GetChatMessagesView.as_view(), name='get_chat_messages'),
    path('select/', SelectGuideView.as_view(), name='select_guide'),
]
