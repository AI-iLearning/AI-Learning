from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from schedule.models import Schedule, Place, DateMemo
from .models import Location
from geopy.distance import geodesic
import datetime
import requests
from datetime import datetime, timedelta
import pandas as pd
import os
from django.http import JsonResponse
from django.conf import settings
from django.views import View
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
    


# CSV 파일 처리 함수 이게 날씨 반환 부분임
def process_csv(csv_path):
    try:
        df = pd.read_csv(csv_path)
        df_cleaned = df.dropna(subset=['nx', 'ny'])
        df_cleaned['nx'] = df_cleaned['nx'].astype(int)
        df_cleaned['ny'] = df_cleaned['ny'].astype(int)
        return df_cleaned
    except UnicodeDecodeError as e:
        print(f"파일 인코딩 오류 발생: {e}")
        return None
    except ValueError as ve:
        print(f"데이터 변환 오류 발생: {ve}")
        return None

# 날씨 데이터를 가져오는 함수
def fetch_weather_data(nx, ny, base_date, base_time):
    AUTH_KEY = '6aK/Q9uwsWRWpFZp/8espTilN9gm1srYYZNCEH/lpj/58Q2WLUBFui2z4Zzfr6xSVp92q4Jyq6pzPWzkWPYO+A=='  # 인증키 입력
    params = {
        'ServiceKey': AUTH_KEY,
        'pageNo': '1',
        'numOfRows': '1000',
        'dataType': 'JSON',
        'base_date': base_date,
        'base_time': base_time,
        'nx': nx,
        'ny': ny
    }

    response = requests.get('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', params=params, verify=True)
    if response.status_code == 200:
        try:
            data = response.json()
            forecast_data = data.get('response', {}).get('body', {}).get('items', {}).get('item', [])
            results = []
            for item in forecast_data:
                if item.get('category') == 'PTY' and item.get('fcstValue') in ['1', '2', '3', '4']:
                    results.append({
                        "date": item.get('fcstDate'),
                        "weather": int(item.get('fcstValue')),
                        "nx": item.get('nx'),
                        "ny": item.get('ny')
                    })
            return results
        except ValueError as ve:
            print(f"JSON 파싱 오류: {ve}")
            return []
    else:
        print(f"요청 실패: {response.status_code}")
        return []

# 요청 처리 함수
def process_request(start_date, end_date, csv_path):
    df = process_csv(csv_path)
    weather_results = []
    unique_results = set()

    if df is None:
        return weather_results

    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")
    base_time = "0500"

    current_date = start_date
    while current_date <= end_date:
        base_date_str = current_date.strftime("%Y%m%d")
        for _, row in df.iterrows():
            nx = row['nx']
            ny = row['ny']
            forecast_data = fetch_weather_data(nx, ny, base_date_str, base_time)
            contentid = row['contentid']
            title = row['title']

            for forecast in forecast_data:
                if forecast['nx'] == nx and forecast['ny'] == ny and contentid not in unique_results:
                    weather_results.append({
                        "date": forecast['date'],
                        "weather": forecast['weather'],
                        "contentid": contentid,
                        "place": title
                    })
                    unique_results.add(contentid)
        current_date += timedelta(days=1)

    return weather_results

# WeatherView 클래스
class WeatherView(View):
    def get(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        csv_path = r'/home/mheejeong12/ailearning/AI-Learning/backend/calender/data/merged_with_nx_ny.csv'  # CSV 경로

        if not start_date or not end_date:
            return JsonResponse({"error": "start_date and end_date are required"}, status=400)

        weather_results = process_request(start_date, end_date, csv_path)
        return JsonResponse(weather_results, safe=False)
