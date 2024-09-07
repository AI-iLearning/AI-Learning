from rest_framework import serializers
from .models import Schedule, Place

class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ['date', 'city', 'place']

class ScheduleSerializer(serializers.ModelSerializer):
    places = PlaceSerializer(many=True)

    class Meta:
        model = Schedule
        fields = ['duration_start', 'duration_end', 'period', 'description', 'places']
