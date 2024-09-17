
from django.urls import path
from .views import get_top_100

urlpatterns = [
    path('rank/get/', get_top_100, name='get_top_100'),
]
