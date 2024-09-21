from django.http import JsonResponse
import json
import pandas as pd

def get_top_100(request):
    try:
        # 데이터 로드
        with open('/home/mheejeong12/ailearning/AI-Learning/backend/rank/historical_sites.json', 'r') as file:
            historical_sites = json.load(file)

        # 카테고리 정의
        categories = ['prehistoric', 'threekingdoms', 'goryeo', 'chosun', 'modern']
        
        # CSV 파일에서 추가 데이터 로드
        csv_data_12 = pd.read_csv('/home/mheejeong12/ailearning/AI-Learning/backend/calender/data/12.csv')
        csv_data_14 = pd.read_csv('/home/mheejeong12/ailearning/AI-Learning/backend/calender/data/14.csv')

        # 데이터 결합
        combined_data = []
        seen_places = set()  # 중복 제거를 위한 집합

        # 각 카테고리 데이터 처리
        for category in categories:
            for site in historical_sites[category]:
                place = site.get('place')
                if not place:
                    continue

                # CSV 파일에서 title에 해당하는 데이터 로드
                data_12 = csv_data_12[csv_data_12['title'] == place]
                data_14 = csv_data_14[csv_data_14['title'] == place]

                # CSV 12 처리
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

                # CSV 14 처리
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

         # 100개가 안될 경우, CSV에서 부족한 개수만큼 추가
        if len(combined_data) < 100:
            additional_items_needed = 100 - len(combined_data)

            # CSV에서 부족한 장소들 추가
            for _, row in pd.concat([csv_data_12, csv_data_14]).iterrows():
                place = row['title']
                item = {
                    'contentid': row['contentid'],
                    'contenttypeid': row['contenttypeid'],
                    'place': place,
                    'firstimage': row['firstimage']
                }
                if place not in seen_places:
                    combined_data.append(item)
                    seen_places.add(place)

                # 100개가 되면 중지
                if len(combined_data) >= 100:
                    break

        # 100개 항목만 반환
        top_100_items = combined_data[:100]
        return JsonResponse(top_100_items, safe=False)

    except Exception as e:
        # 예외 처리
        return JsonResponse({'error': str(e)}, status=500)