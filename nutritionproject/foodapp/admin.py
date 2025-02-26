from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from .models import Food


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
        ]
        return custom_urls + urls


custom_admin_site = CustomAdminSite(name="nutrilanka_admin")


class FoodAdmin(admin.ModelAdmin):
    class Media:
        js = ('foodapp/js/add_food.js', 'foodapp/js/get_food.js', 'foodapp/js/add_food_measurement.js')

custom_admin_site.register(Food, FoodAdmin)


def add_food_measurement_view(request):
    return TemplateResponse(request, "admin/add_food_measurement.html", {})



# admin.site = custom_admin_site
