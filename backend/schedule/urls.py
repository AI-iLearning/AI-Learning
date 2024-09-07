from django.urls import path
from .views import ScheduleCreateView, ScheduleListView, UpdateScheduleView

urlpatterns = [
    path('make', ScheduleCreateView.as_view(), name='schedule-create'),
    path('get', ScheduleListView.as_view(), name='schedule-list'),
    path('edit', UpdateScheduleView.as_view(), name='schedule-update'),
]
