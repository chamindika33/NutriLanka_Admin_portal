
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

        const formData = {
            food_name: $('#id_food_name').val(),
            native_name: $('#id_native_name').val(),
            description: $('#id_description').val(),
            calories: parseFloat($('#id_calories').val()),
            protein: parseFloat($('#id_protein').val()),
            carbohydrates: parseFloat($('#id_carbohydrates').val()),
            water: parseFloat($('#id_water').val()),
            fats: parseFloat($('#id_fat').val()),
            vitamins: parseFloat($('#id_vitamins').val()),
            fiber: parseFloat($('#id_fiber').val()),
            calcium: parseFloat($('#id_calcium').val()),
            magnesium: parseFloat($('#id_magnesium').val()),
            phosphorus: parseFloat($('#id_phosphorus').val()),
            sodium: parseFloat($('#id_sodium').val()),
            potassium: parseFloat($('#id_potassium').val()),
            iron: parseFloat($('#id_iron').val()),
            zinc: parseFloat($('#id_zinc').val()),
            selenium: parseFloat($('#id_selenium').val()),
            copper: parseFloat($('#id_copper').val()),
            manganese: parseFloat($('#id_manganese').val())
        };

        // Send data to the backend API using AJAX
        $.ajax({
            url: 'http://127.0.0.1:8002/nutri-lanka/add-food-record',  
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                alert('Food record added successfully!');
                console.log(response);
                $('#food_form')[0].reset();  // Clear the form
            },
            error: function (error) {
                alert('An error occurred while adding the food record.');
                console.error(error);
            }
        });
    });
});
