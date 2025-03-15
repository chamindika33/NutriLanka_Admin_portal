from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from .models import Food
from .views import export_csv,export_user_csv,export_dietary_csv,export_pdf,export_user_pdf,export_user_dietary_pdf

class CustomAdminSite(admin.AdminSite):
    site_header = "NutriLanka Admin Portal"
    site_title = "NutriLanka Admin"
    index_title = "Welcome to NutriLanka Administration"
    site_url = "/admin/"  
    name = "nutrilanka_admin"  

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('add-food-measurement/', self.admin_view(add_food_measurement_view), name='add_food_measurement'),
            path('update-food/', self.admin_view(update_food_view), name='update_food'),
            path('view-report/', self.admin_view(food_reports_view), name='view_report'),
            path('view-user-report/', self.admin_view(user_reports_view), name='view_user_report'),
            path('view-dietary-report/', self.admin_view(dietary_reports_view), name='view_dietary_report'),
            path("export-csv/", self.admin_view(export_csv), name="export_csv"),
            path("export-pdf/", self.admin_view(export_pdf), name="export_pdf"),
            path("export-user-pdf/", self.admin_view(export_user_pdf), name="export_user_pdf"),
            path("export-user-dietary-pdf/", self.admin_view(export_user_dietary_pdf), name="export_user_dietary_pdf"),
            path("export-user-csv/", self.admin_view(export_user_csv), name="export_user_csv"),
            path("export-dietary-csv/", self.admin_view(export_dietary_csv), name="export_dietary_csv")
        ]
        return custom_urls + urls


custom_admin_site = CustomAdminSite(name="nutrilanka_admin")

class FoodAdmin(admin.ModelAdmin):
    class Media:
        js = ('foodapp/js/add_food.js', 'foodapp/js/get_food.js', 'foodapp/js/add_food_measurement.js','foodapp/js/view_report.js','foodapp/js/food_details.js')
        css = {'all': ('admin/css/custom.css',)}

custom_admin_site.register(Food, FoodAdmin)

def add_food_measurement_view(request):
    return TemplateResponse(request, "admin/add_food_measurement.html", {})

def update_food_view(request):
    return TemplateResponse(request, "admin/update_food.html", {})

def food_reports_view(request):
    return TemplateResponse(request, "admin/view_report.html", {})

def user_reports_view(request):
    return TemplateResponse(request, "admin/view_user_report.html", {})

def user_reports_view(request):
    return TemplateResponse(request, "admin/view_user_report.html", {})

def dietary_reports_view(request):
    return TemplateResponse(request, "admin/view_dietary_report.html", {})


# admin.site = custom_admin_site
