from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
import json
from .models import SendChat

# CustomUser 모델을 가져오기 위해 get_user_model 사용
User = get_user_model()


# Send chat API
class SendChatAPIView(APIView):
    authentication_classes = [JWTAuthentication]  # JWT 인증
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

    def post(self, request):
        try:
            # 요청 바디에서 데이터를 가져옴
            data = json.loads(request.body)
            guide_id = data.get('guideId')
            chat_message = data.get('chat')

            # 사용자 정보 (JWT 토큰으로 인증된 사용자)
            user = request.user

            # 채팅 메시지를 저장 (사용자 정보 포함)
            SendChat.objects.create(guide_id=guide_id, chat_message=chat_message, user=user)

            # 성공 응답 반환
            return JsonResponse({'message': 'Success Response'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)


# Get chat messages API
class GetChatMessagesAPIView(APIView):
    authentication_classes = [JWTAuthentication]  # JWT 인증
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

    def post(self, request):
        try:
            # 요청 바디에서 guideId를 가져옴
            data = json.loads(request.body)
            guide_id = data.get('guideId')

            # 사용자 정보 (JWT 토큰으로 인증된 사용자)
            user = request.user

            # 사용자와 guide_id에 해당하는 채팅 메시지를 필터링
            messages = SendChat.objects.filter(guide_id=guide_id, user=user).values_list('chat_message', flat=True)

            # 메시지 리스트를 JSON 형태로 반환
            return JsonResponse({"chat": list(messages)})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
