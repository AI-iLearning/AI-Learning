from django.urls import path
from .views import UserRegistrationView, AuthAPIView, EmailCheckView, NicknameCheckView, UsersListView, CurrentUserView


app_name = 'common'  # 네임스페이스 설정

urlpatterns = [
    path('signup', UserRegistrationView.as_view(), name='signup'),
    path('login', AuthAPIView.as_view(), name='login'),
    path('user', AuthAPIView.as_view(), name='user'),
    path('logout', AuthAPIView.as_view(), name='logout'),
    path('check-email', EmailCheckView.as_view(), name='email-check'),
    path('check-nickname', NicknameCheckView.as_view(), name='nickname-check'),
    path('list', UsersListView.as_view(), name='all-users'),
    path('member', CurrentUserView.as_view(), name='current-user'),
]
