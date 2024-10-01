from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import SendChat
import json

# CustomUser 모델을 가져오기 위해 get_user_model 사용
User = get_user_model()

# Send chat API
@csrf_exempt
@authentication_classes([JWTAuthentication])  # JWT 인증
@permission_classes([IsAuthenticated])  # 인증된 사용자만 접근 가능
def send_chat(request):
    if request.method == 'POST':
        try:
            # 인증된 사용자 정보 (JWT 토큰으로 인증된 사용자)
            user = request.user

            # 요청 바디에서 데이터를 가져옴
            data = json.loads(request.body)
            guide_id = data.get('guideId')
            chat_message = data.get('chat')

            if not guide_id or not chat_message:
                return JsonResponse({'message': 'Missing guideId or chat_message'}, status=400)

            # 채팅 메시지를 저장 (사용자 정보 포함)
            SendChat.objects.create(guide_id=guide_id, chat_message=chat_message, user=user)

            # 성공 응답 반환
            return JsonResponse({'message': 'Success Response'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'message': 'Method Not Allowed'}, status=405)


# Get chat messages API
@csrf_exempt
@authentication_classes([JWTAuthentication])  # JWT 인증
@permission_classes([IsAuthenticated])  # 인증된 사용자만 접근 가능
def get_chat_messages(request):
    if request.method == 'POST':
        try:
            # 인증된 사용자 정보 (JWT 토큰으로 인증된 사용자)
            user = request.user

            # 요청 바디에서 guideId를 가져옴
            data = json.loads(request.body)
            guide_id = data.get('guideId')

            if not guide_id:
                return JsonResponse({'message': 'Missing guideId'}, status=400)

            # 사용자와 guide_id에 해당하는 채팅 메시지를 필터링
            messages = SendChat.objects.filter(guide_id=guide_id, user=user).values_list('chat_message', flat=True)

            # 메시지 리스트를 JSON 형태로 반환
            return JsonResponse({"chat": list(messages)})

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format'}, status=400)

    return JsonResponse({'message': 'Method Not Allowed'}, status=405)
