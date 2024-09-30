from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import SendChat

@csrf_exempt
def send_chat(request):
    if request.method == 'POST':
        try:
            auth_header = request.headers.get('Authorization')
            print(f"Authorization Header: {auth_header}")
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'message': 'Unauthorized'}, status=401)

            data = json.loads(request.body)
            guide_id = data.get('guideId')
            chat_message = data.get('chat')
            print(f"Guide ID: {guide_id}, Chat Message: {chat_message}")
            SendChat.objects.create(guide_id=guide_id, chat_message=chat_message)

            # 채팅 메시지를 처리
            return JsonResponse({'message': 'Success Response'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
    return JsonResponse({'message': 'Method Not Allowed'}, status=405)

@csrf_exempt
def get_chat_messages(request):
    if request.method == 'POST':
        try:
            # 요청 바디에서 JSON 형식으로 guideId를 가져옴
            data = json.loads(request.body)
            guide_id = data.get('guideId')

            # guideId에 해당하는 채팅 메시지를 필터링
            messages = SendChat.objects.filter(guide_id=guide_id).values_list('chat_message', flat=True)

            # 메시지 리스트를 JSON 형태로 반환
            return JsonResponse({"chat": list(messages)})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
 