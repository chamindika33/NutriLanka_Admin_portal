function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1];
    return cookieValue || '';
}

$(document).ready(function ($) {
    $('#food_form').on('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission

        const payload = {
            food_name: $('#id_food_name').val(),
            native_name: $('#id_native_name').val(),
            description: $('#id_description').val(),
            calories: parseFloat($('#id_calories').val()) || 0,
            protein: parseFloat($('#id_protein').val()) || 0,
            carbohydrates: parseFloat($('#id_carbohydrates').val()) || 0,
            water: parseFloat($('#id_water').val()) || 0,
            fats: parseFloat($('#id_fat').val()) || 0,
            vitamins: parseFloat($('#id_vitamins').val()) || 0,
            fiber: parseFloat($('#id_fiber').val()) || 0,
            calcium: parseFloat($('#id_calcium').val()) || 0,
            magnesium: parseFloat($('#id_magnesium').val()) || 0,
            phosphorus: parseFloat($('#id_phosphorus').val()) || 0,
            sodium: parseFloat($('#id_sodium').val()) || 0,
            potassium: parseFloat($('#id_potassium').val()) || 0,
            iron: parseFloat($('#id_iron').val()) || 0,
            zinc: parseFloat($('#id_zinc').val()) || 0,
            selenium: parseFloat($('#id_selenium').val()) || 0,
            copper: parseFloat($('#id_copper').val()) || 0,
            manganese: parseFloat($('#id_manganese').val()) || 0,
            food_img: null // Placeholder for the Base64 image
        };

        const fileInput = $('#id_food_image')[0];
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const base64Image = e.target.result; // Full Base64-encoded image
                payload.food_img = base64Image; // Add the Base64 image to the payload

                // Send the payload as JSON
                sendData(payload);
            };
            reader.readAsDataURL(file); // Read the file as a Base64 string
        } else {
            console.error("No file selected or file input element is missing.");
            sendData(payload); // Send the payload without an image
        }
    });

    function sendData(formData) {
        $.ajax({
            url: 'http://127.0.0.1:8002/nutri-lanka/add-food-record',
            type: 'POST',
            contentType: 'application/json',
            // processData: false, // Prevent jQuery from processing FormData
            // contentType: false, // Allow the browser to set the Content-Type
            data: JSON.stringify(formData),
            headers: {
                'X-CSRFToken': getCSRFToken() // Include CSRF token if required
            },
            success: function (response) {
                alert('Food record added successfully!');
                console.log(response);
                $('#food_form')[0].reset(); // Clear the form
            },
            error: function (error) {
                alert('An error occurred while adding the food record.');
                console.error(error);
            }
        });
    }

    $('#food_form').on('reset', function (e) {
        e.reset();
    });
});


document.addEventListener("DOMContentLoaded", () => {
    // Extract the food ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const food_name = urlParams.get("food_name");

    if (food_name) {
        fetchFoodDetails(food_name);
    } else {
        console.error("No food name provided in the URL.");
    }
});

function fetchFoodDetails(foodname) {
    const apiUrl = `http://127.0.0.1:8002/nutri-lanka/get-food-nutrition-info?size=100&name=${foodname}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch food details");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Food details:", data);
            displayFoodDetails(data);
        })
        .catch((error) => {
            console.error("Error fetching food details:", error);
        });
}

function displayFoodDetails(data) {
    const foodDetailsContainer = document.getElementById("food-details");
    if (!foodDetailsContainer) {
        console.error("Food details container not found in the DOM.");
        return;
    }

    foodDetailsContainer.innerHTML = `
        <h1>${data.food_name}</h1>
        <p><strong>Native Name:</strong> ${data.native_name}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Calories:</strong> ${data.calories}</p>
        <p><strong>Protein:</strong> ${data.protein}</p>
        <!-- Add other fields as needed -->
    `;
}