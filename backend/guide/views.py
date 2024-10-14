from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import SendChat
from django.contrib.auth import get_user_model
import json
from django.db.models import Max
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
#select api
class SelectGuideView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # JWT 인증된 사용자 정보

        # 1~20 가이드 중에서 대화한 가이드들을 필터링
        latest_chats = (
            SendChat.objects.filter(user=user, guide_id__range=(1, 20))
            .values('guide_id')
            .annotate(latest_chat_time=Max('created_at'))
            .order_by('-latest_chat_time')
        )

        guide_chat_data = {}
        for entry in latest_chats:
            guide_id = entry['guide_id']
            chat_messages = SendChat.objects.filter(
                user=user, guide_id=guide_id
            ).order_by('created_at').values_list('chat_message', flat=True)
            guide_chat_data[guide_id] = list(chat_messages)

        response_data = [
            {
                "guideId": guide_id,
                "chat": chat_messages
            }
            for guide_id, chat_messages in guide_chat_data.items()
        ]

        return Response(response_data, status=200)
