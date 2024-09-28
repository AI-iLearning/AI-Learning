from django.db import models

class SendChat(models.Model):
    guide_id = models.IntegerField()
    chat_message = models.TextField()

    def __str__(self):
        return self.chat_message
