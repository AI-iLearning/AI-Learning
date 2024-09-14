
from django.db import models
from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):  # Django 기본 사용자 모델을 상속
    kakao_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    kakao_access_token = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username
