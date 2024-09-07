from django.urls import path
from .views import ProfileUpdateView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('profile-update', ProfileUpdateView.as_view(), name='profile_update'),
]
