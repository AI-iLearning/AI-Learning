from django.http import JsonResponse
import json
import pandas as pd

def get_top_100(request):
    try:
        # 데이터 로드
        with open('/home/mheejeong12/ailearning/AI-Learning/backend/rank/historical_sites.json', 'r') as file:
            historical_sites = json.load(file)

        # CSV 파일에서 추가 데이터 로드
        csv_data_12 = pd.read_csv('/home/mheejeong12/ailearning/AI-Learning/backend/calender/data/12.csv')
        csv_data_14 = pd.read_csv('/home/mheejeong12/ailearning/AI-Learning/backend/calender/data/14.csv')

        # 데이터 결합
        combined_data = []
        seen_places = set()  # 중복 제거를 위한 집합

        for site in historical_sites:
            place = site['place']

            # CSV 파일에서 title에 해당하는 데이터 로드
            data_12 = csv_data_12[csv_data_12['title'] == place]
            data_14 = csv_data_14[csv_data_14['title'] == place]

            for _, row in data_12.iterrows():
                item = {
                    'contentid': row['contentid'],
                    'contenttypeid': row['contenttypeid'],
                    'place': place,
                    'firstimage': row['firstimage']
                }
                if place not in seen_places:
                    combined_data.append(item)
                    seen_places.add(place)

            for _, row in data_14.iterrows():
                item = {
                    'contentid': row['contentid'],
                    'contenttypeid': row['contenttypeid'],
                    'place': place,
                    'firstimage': row['firstimage']
                }
                if place not in seen_places:
                    combined_data.append(item)
                    seen_places.add(place)

        #  100개 항목만 반환
        top_100_items = combined_data[:100]

        return JsonResponse(top_100_items, safe=False)

    except Exception as e:
        # 예외 처리
        return JsonResponse({'error': str(e)}, status=500)
