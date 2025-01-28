from django.shortcuts import render,redirect
from django.views import View
from .forms import FoodForm
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .forms import FoodForm


# def add_food(request):
#     if request.method == "POST":
#         form = FoodForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return redirect('success')  # Define a success page later
#     else:
#         form = FoodForm()
#     return render(request, 'add_food.html', {'form': form})


def login_view(request):
    return render(request, 'login.html')





