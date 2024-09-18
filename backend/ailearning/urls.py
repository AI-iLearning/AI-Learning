from django.urls import path, include
from .views.auth_views import kakao_callback
from .views.token_views import kakao_new_access

urlpatterns = [
    path('members/kakao-callback/', kakao_callback, name='kakao-callback'),
    path('members/kakao-new-access/', kakao_new_access, name='kakao-new-access'),
    path('calendar/', include('ailearning.calendar.urls'))
]
