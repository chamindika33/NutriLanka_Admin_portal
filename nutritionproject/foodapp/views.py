from django.shortcuts import render,redirect
from django.views import View
from .forms import FoodForm
import json
import csv
from django.http import HttpResponse
import requests
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
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

def export_pdf(request):
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="food_report.pdf"'

    # Create PDF canvas
    pdf = canvas.Canvas(response, pagesize=landscape(letter))
    pdf.setFont("Helvetica", 12)

    # Fetch Data from API
    response_data = requests.post(API_URL, json={"page_number": 1, "record_per_page": 100})
    if response_data.status_code == 200:
        food_records = response_data.json()["data"]["data"]
    else:
        food_records = []

    # Title
    pdf.drawString(50, 550, "NutriLanka Food Report")

    # Table Header
    x_offset = 50
    y_offset = 520
    headers = ["Food ID", "Food Name", "Native Name", "Description", "Calories", "Water", "Protein",
        "Carbohydrates", "Fat", "Fiber", "Iron", "Sodium", "Calcium", "Magnesium", "Phosphorus",
        "Potassium", "Zinc", "Vitamins", "Selenium", "Manganese"]
    for header in headers:
        pdf.drawString(x_offset, y_offset, header)
        x_offset += 100

    # Table Content
    y_offset -= 20
    for food in food_records:
        x_offset = 50
        pdf.drawString(x_offset, y_offset, str(food["food_id"]))
        pdf.drawString(x_offset + 100, y_offset, food["food_name"])
        pdf.drawString(x_offset + 100, y_offset, food["native_name"])
        pdf.drawString(x_offset + 100, y_offset, food["description"])
        pdf.drawString(x_offset + 200, y_offset, str(food["calories"]))
        pdf.drawString(x_offset + 200, y_offset, str(food["water"]))
        pdf.drawString(x_offset + 300, y_offset, str(food["protein"]))
        pdf.drawString(x_offset + 400, y_offset, str(food["carbohydrates"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["fat"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["fiber"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["iron"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["sodium"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["calcium"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["magnesium"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["phosphorus"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["potassium"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["zinc"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["vitamins"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["selenium"]))
        pdf.drawString(x_offset + 500, y_offset, str(food["manganese"]))
        y_offset -= 20

    pdf.showPage()
    pdf.save()
    return response






