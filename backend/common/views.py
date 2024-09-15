from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        print(user)
        refresh = RefreshToken.for_user(user)
        res = Response(
            {
                "message": "signup success",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED,
        )
        return res

class AuthAPIView(APIView):
    # 유저 정보 확인
    def get(self, request):
        try:
            # access token을 decode 해서 유저 id 추출 => 유저 식별
            access = request.COOKIES.get('access')
            if not access:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
            pk = payload.get('user_id')
            user = get_object_or_404(User, pk=pk)
            serializer = UserSerializer(instance=user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            # 토큰 만료 시 토큰 갱신
            refresh = request.COOKIES.get('refresh')
            if not refresh:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            data = {'refresh': refresh}
            serializer = TokenRefreshSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                access = serializer.validated_data.get('access')
                payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
                pk = payload.get('user_id')
                user = get_object_or_404(User, pk=pk)
                serializer = UserSerializer(instance=user)
                res = Response(serializer.data, status=status.HTTP_200_OK)
                res.set_cookie('access', access, httponly=True)
                res.set_cookie('refresh', refresh, httponly=True)
                return res
            raise jwt.InvalidTokenError

        except jwt.InvalidTokenError:
            # 사용 불가능한 토큰일 때
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # 로그인
    def post(self, request):
        print(request.data)
        # 유저 인증
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)
        print(user)
        # 이미 회원가입 된 유저일 때
        if user is not None:
            serializer = UserSerializer(user)
            # jwt 토큰 접근
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "token": access_token,
                },
                status=status.HTTP_200_OK,
            )
            # jwt 토큰 => 쿠키에 저장
            res.set_cookie("access", access_token, httponly=True)
            res.set_cookie("refresh", refresh_token, httponly=True)
            return res
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # 로그아웃
    def delete(self, request):
        # 쿠키에 저장된 토큰 삭제 => 로그아웃 처리
        response = Response({
            "message": "Logout success"
            }, status=status.HTTP_202_ACCEPTED)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response


class EmailCheckView(APIView):
    def post(self, request):
        print(request.data)
        email = request.data.get('email')
        print(email)
        if email is None:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        is_exist = User.objects.filter(email=email).exists()
        print(is_exist)
        return Response({"isExist": is_exist}, status=status.HTTP_200_OK)
    
    
class NicknameCheckView(APIView):
    def post(self, request):
        nickname = request.data.get('nickname')
        if nickname is None:
            return Response({"detail": "Nickname is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        is_exist = User.objects.filter(nickname=nickname).exists()
        return Response({"isExist": is_exist}, status=status.HTTP_200_OK)
    
    
class UsersListView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            # 인증된 사용자 정보 가져오기
            user = request.user
            print(user)
            if not user.is_authenticated:
                return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

            # 사용자 정보를 시리얼라이즈하여 응답 데이터 구성
            user_data = {
                "id": user.id,
                "email": user.email,
                "nickname": user.nickname,
                "profile": user.profile,
                "birth": user.birth,
                "city": user.city,
                "levels": {
                    "prehistoric": user.prehistoric,
                    "threeKingdoms": user.threeKingdoms,
                    "goryeo": user.goryeo,
                    "chosun": user.chosun,
                    "modern": user.modern
                }
            }
            print(user_data)  # 디버깅을 위한 출력
            
            return Response(user_data, status=status.HTTP_200_OK)

        except TokenError as e:
            print(f"Token error: {e}")  # 디버깅을 위한 출력
            return Response({"detail": "Token error"}, status=status.HTTP_401_UNAUTHORIZED)
        except InvalidToken as e:
            print(f"Invalid token: {e}")  # 디버깅을 위한 출력
            return Response({"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"Exception: {e}")  # 디버깅을 위한 출력
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
        
class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user  # 현재 인증된 사용자 가져오기

        # 사용자가 보낸 데이터 가져오기
        data = request.data

        # nickname 업데이트
        if 'nickname' in data and data['nickname']:
            user.nickname = data['nickname']

        # birth 업데이트
        if 'birth' in data and data['birth']:
            user.birth = data['birth']

        # city 업데이트
        if 'city' in data and data['city']:
            user.city = data['city']

        # 변경된 정보 저장
        user.save()

        return Response({"detail": "User information updated successfully"}, status=status.HTTP_200_OK)

#로그인
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
