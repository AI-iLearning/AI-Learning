from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from common.models import CustomUser
from .serializers import ProfileUpdateSerializer
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.parsers import MultiPartParser, FormParser


class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        print("Request data: ", request.data.dict())
        print("Request FILES: ", request.FILES)
        
        file = request.FILES.get('profile')
        
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the file and get the URL
        file_name = default_storage.save(f'profiles/{file.name}', ContentFile(file.read()))
        file_url = "https://possg.duckdns.org/" + default_storage.url(file_name)

        # Update user profile
        user.profile = file_url
        user.save()

        return Response({'message': 'Profile updated successfully!', 'profile_url': file_url}, status=status.HTTP_200_OK)
