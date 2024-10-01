from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from django.conf import settings
from .models import SendChat
from django.shortcuts import get_object_or_404
from common.models import User  # User 모델이 common 앱에 있다고 가정

# Send chat
@csrf_exempt
def send_chat(request):
    if request.method == 'POST':
        try:
            # 헤더에서 Authorization Bearer 토큰을 가져옴
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'message': 'Unauthorized'}, status=401)

            # Bearer 토큰에서 실제 JWT 토큰 추출
            token = auth_header.split(' ')[1]

            # JWT 토큰 디코딩 (시크릿 키는 settings.py에서 설정)
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')
                user = get_object_or_404(User, pk=user_id)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'message': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'message': 'Invalid token'}, status=401)

            # 요청 바디에서 데이터를 가져옴
            data = json.loads(request.body)
            guide_id = data.get('guideId')
            chat_message = data.get('chat')

            # 채팅 메시지를 저장 (사용자 정보 포함)
            SendChat.objects.create(guide_id=guide_id, chat_message=chat_message, user=user)

            # 성공 응답 반환
            return JsonResponse({'message': 'Success Response'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
    return JsonResponse({'message': 'Method Not Allowed'}, status=405)

# Get chat messages
@csrf_exempt
def get_chat_messages(request):
    if request.method == 'POST':
        try:
            # 헤더에서 Authorization Bearer 토큰을 가져옴
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'message': 'Unauthorized'}, status=401)

            # Bearer 토큰에서 실제 JWT 토큰 추출
            token = auth_header.split(' ')[1]

            # JWT 토큰 디코딩
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')
                user = get_object_or_404(User, pk=user_id)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'message': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'message': 'Invalid token'}, status=401)

            # 요청 바디에서 guideId를 가져옴
            data = json.loads(request.body)
            guide_id = data.get('guideId')

            # 사용자와 guide_id에 해당하는 채팅 메시지를 필터링
            messages = SendChat.objects.filter(guide_id=guide_id, user=user).values_list('chat_message', flat=True)

            # 메시지 리스트를 JSON 형태로 반환
            return JsonResponse({"chat": list(messages)})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
