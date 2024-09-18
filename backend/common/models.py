from django.contrib.auth.models import AbstractUser, BaseUserManager,User
from django.db import models
from django.conf import settings


class CustomUserManager(BaseUserManager):
    def create_user(self, email, nickname, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, nickname=nickname, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nickname, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, nickname, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None  # username 필드를 제거합니다.
    email = models.EmailField(unique=True)
    nickname = models.CharField(max_length=30, unique=True)
    profile = models.CharField(max_length=255, null=True, blank=True, default='/home/honglee0317/AiLearning/media/profile_default.png')
    prehistoric = models.IntegerField(default=0)
    threeKingdoms = models.IntegerField(default=0)
    goryeo = models.IntegerField(default=0)
    chosun = models.IntegerField(default=0)
    modern = models.IntegerField(default=0)
    birth = models.IntegerField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)