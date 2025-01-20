from django.shortcuts import render,redirect
from django.views import View
from .forms import FoodForm
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .forms import FoodForm

@csrf_exempt  # Only use if you cannot add CSRF token in your AJAX request
@require_http_methods(["POST", "GET"])
def add_food(request):
    if request.method == "POST":
        try:
            # Parse JSON data
            data = json.loads(request.body)
            form = FoodForm(data)
            if form.is_valid():
                form.save()
                return JsonResponse({'message': 'Food record added successfully!'}, status=201)
            else:
                return JsonResponse({'errors': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
    else:
        form = FoodForm()
        return render(request, 'add_food.html', {'form': form})


# def add_food(request):
#     if request.method == "POST":
#         form = FoodForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return redirect('success')  # Define a success page later
#     else:
#         form = FoodForm()
#     return render(request, 'add_food.html', {'form': form})

# @csrf_exempt
# def add_food(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)  # Parse JSON payload
#             form = FoodForm(data)
#             if form.is_valid():
#                 form.save()
#                 return JsonResponse({'message': 'Food record added successfully!'}, status=201)
#             else:
#                 return JsonResponse({'errors': form.errors}, status=400)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
#     return JsonResponse({'error': 'Invalid request method'}, status=405)

def login_view(request):
    return render(request, 'login.html')


