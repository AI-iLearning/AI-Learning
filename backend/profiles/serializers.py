from rest_framework import serializers
from common.models import CustomUser

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile']

    def update(self, instance, validated_data):
        instance.profile = validated_data.get('profile', instance.profile)
        instance.save()
        return instance
