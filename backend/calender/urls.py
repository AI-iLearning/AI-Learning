from django.urls import path
from .views import CalendarView, TimelineDayView, TimelineFixView, AllPlaceView, WeatherView 

urlpatterns = [
    path('timeline-all', CalendarView.as_view(), name='schedule-list'),
    path('timeline-day', TimelineDayView.as_view(), name='timeline-day'),
    path('timeline-fix', TimelineFixView.as_view(), name='timeline-fix'),
    path('all-place', AllPlaceView.as_view(), name='all-place'),
    path('weather/', WeatherView.as_view(), name='weather'),
]
    

