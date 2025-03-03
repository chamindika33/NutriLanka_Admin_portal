from django.contrib import admin
from django.urls import path
from foodapp.admin import custom_admin_site 
from .views import export_csv 

urlpatterns = [
    path("admin/", custom_admin_site.urls), 
    path("admin/export-csv/", export_csv, name="export_csv"), 
]
