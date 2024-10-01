from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import SendChat
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

User = get_user_model()

@csrf_exempt
def send_chat(request):
    if request.method == 'POST':
        try:
            # Authorization Bearer 토큰 가져오기
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'message': 'Unauthorized'}, status=401)

            # Bearer 토큰에서 JWT 추출
            token = auth_header.split(' ')[1]

            # JWT 토큰 디코딩
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')  # 사용자 ID 추출
                user = get_object_or_404(User, pk=user_id)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'message': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'message': 'Invalid token'}, status=401)

            # 요청 바디에서 데이터 가져오기
            try:
                data = json.loads(request.body)
                guide_id = data.get('guideId')
                chat_message = data.get('chat')
                if not guide_id or not chat_message:
                    return JsonResponse({'message': 'Missing guideId or chat_message'}, status=400)
            except (json.JSONDecodeError, KeyError) as e:
                return JsonResponse({'message': f'Invalid JSON or missing field: {str(e)}'}, status=400)

            # 채팅 메시지 저장
            SendChat.objects.create(guide_id=guide_id, chat_message=chat_message, user=user)

            return JsonResponse({'message': 'Success Response'}, status=200)

        except Exception as e:
            return JsonResponse({'message': f'An unexpected error occurred: {str(e)}'}, status=500)

    return JsonResponse({'message': 'Method Not Allowed'}, status=405)


@csrf_exempt
def get_chat_messages(request):
    if request.method == 'POST':
        try:
            # Authorization Bearer 토큰 가져오기
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'message': 'Unauthorized'}, status=401)

            # Bearer 토큰에서 JWT 추출
            token = auth_header.split(' ')[1]

            # JWT 토큰 디코딩
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')  # 사용자 ID 추출
                user = get_object_or_404(User, pk=user_id)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'message': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'message': 'Invalid token'}, status=401)

            # 요청 바디에서 guideId 가져오기
            try:
                data = json.loads(request.body)
                guide_id = data.get('guideId')
                if not guide_id:
                    return JsonResponse({'message': 'Missing guideId'}, status=400)
            except (json.JSONDecodeError, KeyError) as e:
                return JsonResponse({'message': f'Invalid JSON or missing field: {str(e)}'}, status=400)

            # 메시지 필터링
            messages = SendChat.objects.filter(guide_id=guide_id, user=user).values_list('chat_message', flat=True)

            return JsonResponse({"chat": list(messages)})

        except Exception as e:
            return JsonResponse({'message': f'An unexpected error occurred: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
