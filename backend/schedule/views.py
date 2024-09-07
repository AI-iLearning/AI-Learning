from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from .models import Schedule, Place
from calender.models import Location
from .serializers import ScheduleSerializer, PlaceSerializer
import openai
import json
from openai import OpenAI
import datetime

import sys
sys.path.append("/home/honglee0317/AiLearning/backend/config")
from my_settings import *



client = OpenAI(
    api_key = OPENAI_API_KEY,
)




class ScheduleCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        duration = data.get('duration')
        period = data.get('period')
        description = data.get('description')
        places = data.get('places')
        styles = data.get('style')

        if not duration or not period or not places or not styles:
            return Response({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        schedule = Schedule.objects.create(
            user=user,
            duration_start=duration[0],
            duration_end=duration[1],
            period=period,
            description=description
        )

        place_data = self.generate_places(duration, places, styles, description)
        print("pd:", place_data)
        for pd in place_data:
            Place.objects.create(schedule=schedule, **pd)  # schedule 필드를 올바르게 설정

        serializer = ScheduleSerializer(schedule)
        print(serializer.data)
        return Response({"message": "success"}, status=status.HTTP_201_CREATED)




    ############## Location의 sigungucode에 places를 대입 ##############
    def generate_places(self, duration, places, styles, description):
        place_data = []
        
        '''
        # 모든 Location 객체 가져오기
        locations = Location.objects.all()

        # 가져온 모든 Location 객체 출력하기
        for location in locations:
            print(location.title, location.sigungucode, type(location.sigungucode))
        print()
        '''
        
        
        places = ["1"]
        print(places)
        # 시군구 코드로 Location 객체 필터링하여 title 가져오기
        locations = Location.objects.filter(areacode = 1)

        # 필터링된 Location 객체에서 title(장소 이름)을 모두 가져오기
        prompt_places = []
        for location in locations:
            place_name = location.title
            prompt_places.append(place_name)
        
        #print(prompt_places)
        
        for date in duration:
            for place, style in zip(places, styles):
                prompt = f"""Generate a place object for date {date}, place {place}, and style {style}. json 응답 외에 다른 말은 하지 마.
                
                you must have to select place based on this catalogs.
                {prompt_places}
                
                city: range of region which is matched with '시' size(ex. 인천, 서울, 천안)
                
                Don't forget to reflect the following:\n{description}\n
                example output:

                [
                    {{
                        "date": "2024-10-24",
                        "city": "경주",
                        "place": "불국사", 
                    }},
                    {{
                        "date": "2024-10-30",
                        "city": "경주",
                        "place": "석굴암", 
                    }},
                    {{
                        "date": "2024-11-03",
                        "city": "경주",
                        "place": "안압지",
                    }}
                ]
                
                \n\n
                ### Keep in mind
                - You must not include any other string except json answer
                - You should select various place to travel.
                """
                messages = [
                    {"role": "system", "content": "You are a helpful tour guide who plans the places to travel."},
                    {"role": "user", "content": prompt}
                ]
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=messages
                )

                place_info = response.choices[0].message.content
                print("place_info:", place_info)
             
                try:
                    place_info_json = json.loads(place_info)
                except json.JSONDecodeError as e:
                    print(f"Failed to parse JSON: {e}")

                    continue

                

                for item in place_info_json:
                    place_data.append({
                        "date": item["date"],
                        "city": item["city"],
                        "place": item["place"]
                    })
            print("place_data:", place_data)
        return place_data   
    
class ScheduleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Schedule 객체들 조회 (필요에 따라 필터링)
        schedules = Schedule.objects.filter(user=user)
        place_data = []

        # 각 Schedule에 속한 Place 객체들을 조회하여 리스트에 추가
        for schedule in schedules:
            places = Place.objects.filter(schedule=schedule)
            for place in places:
                try:
                    # Location 모델에서 해당 장소 정보를 가져옴
                    location = Location.objects.get(title=place.place, addr1=place.city)
                except Location.DoesNotExist:
                    location = None

                place_data.append({
                    "date": place.date,
                    "areacode": location.areacode if location else None,
                    "sigungucode": location.sigungucode if location else None,
                    "place": place.place
                })

        return Response(place_data, status=status.HTTP_200_OK)



class UpdateScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        new_places = request.data

        if not new_places:
            return Response({"detail": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

        # 가장 최근에 생성된 Schedule 객체 가져오기
        schedule = Schedule.objects.filter(user=user).order_by('-created_at').first()
        if not schedule:
            return Response({"detail": "No schedule found for the user"}, status=status.HTTP_404_NOT_FOUND)

        # 기존 Place 객체들 삭제
        Place.objects.filter(schedule=schedule).delete()

        # 새로운 Place 객체들 생성
        response_data = []
        for place_data in new_places:
            # Place 객체 생성
            place = Place.objects.create(
                schedule=schedule,
                date=place_data["date"],
                city=place_data.get("city"),
                place=place_data["place"]
            )

            # Location 모델에서 일치하는 장소 정보 가져오기
            try:
                location = Location.objects.get(title=place.place, addr1=place.city)
                areacode = location.areacode
                sigungucode = location.sigungucode
            except Location.DoesNotExist:
                areacode = None
                sigungucode = None

            # 응답 데이터에 추가
            response_data.append({
                "date": place.date.strftime('%Y-%m-%d'),
                "areacode": areacode,
                "sigungucode": sigungucode,
                "place": place.place
            })

        return Response(response_data, status=status.HTTP_200_OK)   
    
