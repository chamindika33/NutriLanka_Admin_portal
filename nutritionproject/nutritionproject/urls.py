from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include
from foodapp.admin import custom_admin_site 
# from foodapp.views import add_food


urlpatterns = [
    # path('admin/', admin.site.urls),
    path("admin/", custom_admin_site.urls), 
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
