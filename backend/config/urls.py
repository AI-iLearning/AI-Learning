from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ailearning/members/', include('common.urls')),
    path('ailearning/schedule/', include('schedule.urls')),
    path('ailearning/profile/', include('profiles.urls')),
    path('ailearning/calendar/', include('calender.urls'))
]

# 개발 환경에서 media 파일 제공
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)