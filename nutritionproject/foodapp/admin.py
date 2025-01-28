from django.contrib import admin
from .models import Food

admin.site.site_header = "NutriLanka Admin Portal"
admin.site.site_title = "NutriLanka Admin"
admin.site.index_title = "Welcome to NutriLanka Administration"

class FoodAdmin(admin.ModelAdmin):
    class Media:
        js = ('foodapp/js/add_food.js','foodapp/js/get_food.js') 

admin.site.register(Food,FoodAdmin)
