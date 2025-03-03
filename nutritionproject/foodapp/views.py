from django.shortcuts import render,redirect
from django.views import View
from .forms import FoodForm
import json
import csv
from django.http import HttpResponse
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .forms import FoodForm

API_URL = "http://18.139.84.131:8002/nutri-lanka/all-food-records"
USER_API_URL = "http://18.139.84.131:8002/nutri-lanka/get-all-users"
DIETARY_API_URL = "http://18.139.84.131:8002/nutri-lanka/get-all-users-dietary-data"


def login_view(request):
    return render(request, 'login.html')

def export_csv(request):
    """Exports food report as a CSV file."""
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="food_report.csv"'

    writer = csv.writer(response)
    
    # Write CSV Header
    writer.writerow([
        "Food ID", "Food Name", "Native Name", "Description", "Calories", "Water", "Protein",
        "Carbohydrates", "Fat", "Fiber", "Iron", "Sodium", "Calcium", "Magnesium", "Phosphorus",
        "Potassium", "Zinc", "Vitamins", "Selenium", "Manganese"
    ])
    
    # Fetch Data from API
    response_data = requests.post(API_URL, json={"page_number": 1, "record_per_page": 100})
    if response_data.status_code == 200:
        food_records = response_data.json()["data"]["data"]
    else:
        food_records = []
    
    # Write Data to CSV
    for food in food_records:
        writer.writerow([
            food["food_id"], food["food_name"], food["native_name"], food["description"], food["calories"],
            food["water"], food["protein"], food["carbohydrates"], food["fat"], food["fiber"], food["iron"],
            food["sodium"], food["calcium"], food["magnesium"], food["phosphorus"], food["potassium"],
            food["zinc"], food["vitamins"], food["selenium"], food["manganese"]
        ])

    return response


def export_user_csv(request):
    """Exports food report as a CSV file."""
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="user_report.csv"'

    writer = csv.writer(response)
    
    # Write CSV Header
    writer.writerow([
        "User ID", "User Name", "Email", "Email Verified", "Date of Birth", 
        "Gender", "Location", "Weight", "Height", "BMI Value", "Dietary Preferences", 
        "User Status", "Created at" 
    ])
    
    # Fetch Data from API
    response_data = requests.post(USER_API_URL, json={"page_number": 1, "record_per_page": 100})
    if response_data.status_code == 200:
        user_records = response_data.json()["data"]["data"]
    else:
        user_records = []
    
    # Write Data to CSV
    for user in user_records:
        writer.writerow([
            user["id"], user["name"], user["email"], user["email_verified"], user["date_of_birth"],
            user["gender"], user["location"], user["weight"], user["height"], user["bmi_value"], 
            user["dietary_preferences"], user["status"], user["created_at"]
        ])

    return response


def export_dietary_csv(request):
    """Exports food report as a CSV file."""
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="user_dietary_report.csv"'

    writer = csv.writer(response)
    
    # Write CSV Header
    writer.writerow([
        "Goal ID", "User ID", "target Nutrient", "Target Value", "Breakfast Burn", 
        "Lunch Burn", "Intermediate Burn", "Dinner Burn", "Is Achieved", "Created at", "Updated at"
    ])
    
    # Fetch Data from API
    response_data = requests.post(DIETARY_API_URL, json={"page_number": 1, "record_per_page": 100})
    if response_data.status_code == 200:
        user_records = response_data.json()["data"]["data"]
        print('dietary response-->',user_records)
    else:
        user_records = []
    
    # Write Data to CSV
    for user in user_records:
        writer.writerow([
            user["gole_id"], user["user_id"], user["target_nutrient"], user["target_value"], user["breakfast_burn"],
            user["lunch_burn"], user["intermediate_burn"], user["dinner_burn"], user["is_achieved"], 
            user["created_at"], user["updated_at"]
        ])

    return response






