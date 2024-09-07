from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    levels = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'nickname', 'profile', 'levels', 'password', 'birth', 'city')
        extra_kwargs = {'password': {'write_only': True}}

    def get_levels(self, obj):
        return {
            'prehistoric': obj.prehistoric,
            'threeKingdoms': obj.threeKingdoms,
            'goryeo': obj.goryeo,
            'chosun': obj.chosun,
            'modern': obj.modern
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            nickname=validated_data['nickname'],
            password=validated_data['password'],
            birth=validated_data.get('birth'),
            city=validated_data.get('city'),
            profile=validated_data.get('profile', 'https://possg.duckdns.org/media/profile_default.png'),
            prehistoric=validated_data.get('prehistoric', 0),
            threeKingdoms=validated_data.get('threeKingdoms', 0),
            goryeo=validated_data.get('goryeo', 0),
            chosun=validated_data.get('chosun', 0),
            modern=validated_data.get('modern', 0)
        )
        return user
