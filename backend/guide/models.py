from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class SendChat(models.Model):
    guide_id = models.IntegerField()
    chat_message = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.chat_message
