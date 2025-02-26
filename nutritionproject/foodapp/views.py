from django.shortcuts import render,redirect
from django.views import View
from .forms import FoodForm
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .forms import FoodForm



def login_view(request):
    return render(request, 'login.html')







