from django import forms
from .models import Food

class FoodForm(forms.ModelForm):
    class Meta:
        model = Food
        fields = ['food_name','native_name','description','calories','protein','carbohydrates','water',
                  'fat','vitamins','fiber','calcium','magnesium','phosphorus','sodium','potassium','iron',
                  'zinc','selenium','copper','manganese','food_image']