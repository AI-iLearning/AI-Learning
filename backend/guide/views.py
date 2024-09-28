from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import SendChat

@csrf_exempt
def send_chat(request):
    if request.method == 'POST':
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'message': 'Unauthorized'}, status=401)

            data = json.loads(request.body)
            guide_id = data.get('guideId')
            chat_message = data.get('chat')

            

            return JsonResponse({'message': 'Success Response'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
    return JsonResponse({'message': 'Method Not Allowed'}, status=405)
#채팅 반환
def get_chat_messages(request):
    if request.method == 'POST':
        guide_id = request.POST.get('guideId')  # 요청 바디에서 guideId를 가져옴

        # guideId에 해당하는 채팅 메시지를 필터링
        messages = SendChat.objects.filter(guide_id=guide_id).values_list('chat_message', flat=True)

        return JsonResponse({"chat": list(messages)})  

    return JsonResponse({"error": "Invalid request method"}, status=400)
