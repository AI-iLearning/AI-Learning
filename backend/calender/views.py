from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from schedule.models import Schedule, Place, DateMemo
from .models import Location
from geopy.distance import geodesic
import datetime

from calender.models import Location  # Location 모델을 calender 앱에서 임포트


class CalendarView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user

        # Schedule 객체들 조회 (필요에 따라 필터링)
        schedules = Schedule.objects.filter(user=user)
        calendar_data = {}

        # 각 Schedule에 속한 Place 객체들을 날짜별로 그룹화
        for schedule in schedules:
            places = Place.objects.filter(schedule=schedule)
            for place in places:
                date_str = place.date.strftime('%Y-%m-%d')
                if date_str not in calendar_data:
                    calendar_data[date_str] = []

                # Location 객체에서 contentid와 areacode 가져오기 (장소 이름과 도시 이름으로 검색)
                try:
                    location = Location.objects.get(title=place.place)
                    contentid = location.contentid
                    areacode = location.areacode
                except Location.DoesNotExist:
                    contentid = None  # 매칭되는 Location이 없는 경우 None 설정
                    areacode = None

                calendar_data[date_str].append({
                    "place": place.place,
                    "contentid": contentid,  # contentid 추가
                    "areacode": areacode,  # areacode 추가
                    "order": len(calendar_data[date_str])
                })

        # 최종 응답 데이터 구성
        response_data = []
        for date, places in calendar_data.items():
            response_data.append({
                "date": date,
                "info": places
            })
        #print(response_data)
        return Response(response_data, status=status.HTTP_200_OK)




class TimelineDayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        date_str = request.data.get('date')

        if not date_str:
            return Response({"detail": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"detail": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

        # 해당 유저의 주어진 날짜의 Place 객체들 조회
        places = Place.objects.filter(schedule__user=user, date=date).order_by('id')

        # Schedule 객체는 Place 객체로부터 추출
        schedule = places.first().schedule if places.exists() else None
        
        # 해당 날짜의 DateMemo 조회 또는 기본값 설정
        date_memo = schedule.date_memo if schedule else DateMemo.objects.filter(date=date).first()
        memo = date_memo.memo if date_memo else ""

        # 장소 간 거리 계산 (여기서는 예시 데이터를 사용하여 191, 232로 설정)
        distances = [191, 232] if places.exists() else []

        # 응답 데이터 구성
        info = []
        for i, place in enumerate(places):
            try:
                # Location 모델에서 일치하는 장소 정보 가져오기 (장소 이름으로 검색)
                location = Location.objects.get(title=place.place)
                contentid = location.contentid
                contenttypeid = location.contenttypeid
                areacode = location.areacode
                sigungucode = location.sigungucode
                firstimage = location.firstimage
                mapx = location.mapx
                mapy = location.mapy
            except Location.DoesNotExist:
                contentid = None
                contenttypeid = None
                areacode = None
                sigungucode = None
                firstimage = ""
                mapx = 0
                mapy = 0

            info.append({
                "contentid": contentid,
                "contenttypeid": contenttypeid,
                "areacode": areacode,
                "sigungucode": sigungucode,
                "place": place.place,
                "order": i,
                "firstimage": firstimage,
                "mapx": mapx,
                "mapy": mapy,
            })

        response_data = {
            "memo": memo,
            "date": date_str,
            "distance": distances,
            "info": info
        }
        print(response_data)
        return Response(response_data, status=status.HTTP_200_OK)
    
    
class TimelineFixView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        if not data:
            return Response({"detail": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

        memo = data.get('memo')
        date_str = data.get('date')
        info = data.get('info', [])

        

        try:
            date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"detail": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

        # DateMemo 객체 생성 또는 가져오기
        date_memo, created = DateMemo.objects.get_or_create(date=date, defaults={'memo': memo})
        if not created:
            date_memo.memo = memo
            date_memo.save()

        if not info:
            if date_str:
                
                return Response({"message": "Schedule updated successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Date and info are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Schedule 객체 가져오기 또는 생성하기
        schedule, created = Schedule.objects.get_or_create(
            user=user,
            date_memo=date_memo,
            defaults={'duration_start': date, 'duration_end': date, 'description': memo}
        )

        if not created:
            schedule.description = memo
            schedule.save()

        # 기존 Place 객체들 삭제
        Place.objects.filter(schedule=schedule, date=date).delete()

        # 새로운 Place 객체들 생성
        for i, place_info in enumerate(info):
            Place.objects.create(
                schedule=schedule,
                date=date,
                city=place_info.get('city', ''),
                place=place_info.get('place', '')
            )

        return Response({"message": "Schedule updated successfully"}, status=status.HTTP_200_OK)
    
    
class AllPlaceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Location 모델에서 모든 장소 정보를 가져옴
        locations = Location.objects.all()

        # 응답 데이터 구성
        ## sigungucode->city, areacode->place는 맵을 따로만들어야 할 듯
        response_data = []
        for location in locations:
            response_data.append({
                "contentid": location.contentid,
                "contenttypeid": location.contenttypeid,
                "city": location.sigungucode,
                "place": location.areacode,
                "firstimage": location.firstimage
            })

        return Response(response_data, status=status.HTTP_200_OK)