import csv
import os
import django
from django.conf import settings
import sys
from datetime import datetime

sys.path.append("/home/honglee0317/AiLearning/backend")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')  # 'config'를 실제 프로젝트 설정 모듈로 변경했습니다.

django.setup()

from calender.models import Location

def parse_datetime(datetime_str):
    """ 'YYYYMMDDHHMMSS' 형식의 문자열을 'YYYY-MM-DD HH:MM:SS' 형식으로 변환합니다. """
    try:
        return datetime.strptime(datetime_str, '%Y%m%d%H%M%S')
    except ValueError:
        return None  # 변환 실패 시 None 반환

def run():
    file_path = os.path.join('/home/honglee0317/AiLearning/backend/calender/data', '12.csv')  # CSV 파일 경로
    print(file_path)
    with open(file_path, mode='r', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file)
        for row in reader:
            modifiedtime = parse_datetime(row['modifiedtime']) if row.get('modifiedtime') else None
            Location.objects.create(
                contentid=row['contentid'],
                title=row['title'],
                addr1=row.get('addr1', ''),
                addr2=row.get('addr2', ''),
                areacode=row.get('areacode', ''),
                sigungucode=row.get('sigungucode', ''),
                mapx=row.get('mapx', None),
                mapy=row.get('mapy', None),
                modifiedtime=modifiedtime,  # 변환된 날짜 사용
                firstimage=row.get('firstimage', ''),
                firstimage2=row.get('firstimage2', ''),
                cat1=row.get('cat1', ''),
                cat2=row.get('cat2', ''),
                cat3=row.get('cat3', ''),
                contenttypeid=row.get('contenttypeid', '')
            )
    print('Data imported successfully')

run()
