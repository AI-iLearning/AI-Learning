import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile

@csrf_exempt
def kakao_callback(request):
    if request.method == 'POST':
        access_token = request.POST.get('accessToken')
        if not access_token:
            return JsonResponse({'userExists': False}, status=400)

        try:
            headers = {'Authorization': f'Bearer {access_token}'}
            profile_response = requests.get('https://kapi.kakao.com/v2/user/me', headers=headers)
            profile_response.raise_for_status()
            profile_data = profile_response.json()
            kakao_id = profile_data.get('id')

            if not kakao_id:
                return JsonResponse({'userExists': False}, status=400)

            user, created = UserProfile.objects.get_or_create(kakao_id=kakao_id)
            if created:
                user.kakao_access_token = access_token
                user.save()

            return JsonResponse({'userExists': True})

        except requests.RequestException:
            return JsonResponse({'userExists': False}, status=500)

    return JsonResponse({'userExists': False}, status=400)
