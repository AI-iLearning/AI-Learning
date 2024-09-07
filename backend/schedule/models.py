from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DateMemo(models.Model):
    date = models.DateField(unique=True)
    memo = models.TextField(blank=True)

    def __str__(self):
        return f"{self.date} - {self.memo[:50]}"

class Schedule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    duration_start = models.DateField()
    duration_end = models.DateField()
    period = models.JSONField()
    description = models.TextField()
    date_memo = models.ForeignKey(DateMemo, related_name='schedules', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Place(models.Model):
    schedule = models.ForeignKey(Schedule, related_name='places', on_delete=models.CASCADE)
    date = models.DateField()
    city = models.CharField(max_length=100)
    place = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)