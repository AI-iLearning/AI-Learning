from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import SendChat
from django.contrib.auth import get_user_model
import json

# CustomUser 모델을 가져오기 위해 get_user_model 사용
User = get_user_model()

# Send chat API
class SendChatView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # 인증된 사용자 정보 (JWT 토큰으로 인증된 사용자)
            user = request.user

            # 요청 바디에서 데이터를 가져옴
            data = request.data
            guide_id = data.get('guideId')
            chat_message = data.get('chat')

            if not guide_id or not chat_message:
                return Response({'message': 'Missing guideId or chat_message'}, status=400)

            # 채팅 메시지를 저장 (사용자 정보 포함)
            SendChat.objects.create(guide_id=guide_id, chat_message=chat_message, user=user)

            # 성공 응답 반환
            return Response({'message': 'Success Response'}, status=200)

        except json.JSONDecodeError:
            return Response({'message': 'Invalid JSON'}, status=400)

# Get chat messages API
class GetChatMessagesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # 인증된 사용자 정보 (JWT 토큰으로 인증된 사용자)
            user = request.user

            # 요청 바디에서 guideId를 가져옴
            data = request.data
            guide_id = data.get('guideId')

            if not guide_id:
                return Response({'message': 'Missing guideId'}, status=400)

            # 사용자와 guide_id에 해당하는 채팅 메시지를 필터링
            messages = SendChat.objects.filter(guide_id=guide_id, user=user).values_list('chat_message', flat=True)

            # 메시지 리스트를 JSON 형태로 반환
            return Response({"chat": list(messages)}, status=200)

        except json.JSONDecodeError:
            return Response({'message': 'Invalid JSON format'}, status=400)
