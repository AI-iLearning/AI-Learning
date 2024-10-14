from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


def get_default_user():
    return User.objects.filter(username='default_user').first() or None

class SendChat(models.Model):
    guide_id = models.IntegerField()
    chat_message = models.TextField(default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, default=get_default_user)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.chat_message