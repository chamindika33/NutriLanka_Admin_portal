document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const foodId = urlParams.get("food_id"); 

    if (!foodId) {
        console.error("No food_id found.");
        return;
    }

    // API Endpoint
    const apiUrl = "https://nutrilanka.shop/nutri-lanka/get-food-nutrition-info";
    const payload = {
        food_id: parseInt(foodId),
        unit_id: 7,
        no_of_units: 0,
    };

    // Fetch Food Data
    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            console.log("Food Data:", data);
            populateFoodDetails(data.data);
        } else {
            console.error("Failed to load food details:", data.message);
        }
    })
    .catch(error => console.error("Error fetching food details:", error));

    function populateFoodDetails(foodData) {
        document.getElementById("id_food_name").value = foodData.food_name || "";
        document.getElementById("id_native_name").value = foodData.native_name || "";
        document.getElementById("id_description").value = foodData.description || "";
        document.getElementById("id_calories").value = foodData.calories || "";
        document.getElementById("id_fat").value = foodData.fat || "";
        document.getElementById("id_protein").value = foodData.protein || "";
        document.getElementById("id_carbohydrates").value = foodData.carbohydrates || "";
        document.getElementById("id_fiber").value = foodData.fiber || "";
        document.getElementById("id_water").value = foodData.water || "";
        document.getElementById("id_vitamins").value = foodData.vitamins || "";
        document.getElementById("id_calcium").value = foodData.calcium || "";
        document.getElementById("id_magnesium").value = foodData.magnesium || "";
        document.getElementById("id_phosphorus").value = foodData.phosphorus || "";
        document.getElementById("id_sodium").value = foodData.sodium || "";
        document.getElementById("id_potassium").value = foodData.potassium || "";
        document.getElementById("id_iron").value = foodData.iron || "";
        document.getElementById("id_zinc").value = foodData.zinc || "";
        document.getElementById("id_selenium").value = foodData.selenium || "";
        document.getElementById("id_copper").value = foodData.copper || "";
        document.getElementById("id_manganese").value = foodData.manganese || "";
        
        // Set the food image
        document.getElementById("food-image").src = foodData.food_img || "";
        document.getElementById("food-image").setAttribute("data-existing-img", foodData.food_img || "");
    }

});

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);  // Base64 data
        reader.onerror = (error) => reject(error);
    });
}

async function convertImageUrlToBase64(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return await convertImageToBase64(blob);
    } catch (error) {
        console.error("Error converting URL image to Base64:", error);
        return "";
    }
}
    // Handle Update Button Click
document.getElementById("updateFoodBtn").addEventListener("click", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const foodId = urlParams.get("food_id"); 

    console.log("Extracted Food ID:", foodId);

    if (!foodId) {
        alert("Invalid food ID.");
        return;
    }

    // Get the image data (if available)
    const imageInput = document.getElementById("food-image-upload");
    let base64Image = "";
    let existingImage = document.getElementById("food-image").getAttribute("data-existing-img") || "";
    console.log("Extracted image url:", existingImage);
    let existingImageFilename = existingImage.split("/").pop(); 
    

    if (imageInput && imageInput.files.length > 0) {
        base64Image = await convertImageToBase64(imageInput.files[0]);  // Convert image to base64
    }else {
        console.log("No new image selected, keeping existing one.");
        base64Image = await convertImageUrlToBase64(existingImageFilename);
    }


    const updatedData = {
        // food_id: parseInt(foodId),
        food_name: document.getElementById("id_food_name").value,
        native_name: document.getElementById("id_native_name").value,
        description: document.getElementById("id_description").value,
        calories: parseFloat(document.getElementById("id_calories").value),
        fats: parseFloat(document.getElementById("id_fat").value),
        protein: parseFloat(document.getElementById("id_protein").value),
        carbohydrates: parseFloat(document.getElementById("id_carbohydrates").value),
        fiber: parseFloat(document.getElementById("id_fiber").value),
        water: parseFloat(document.getElementById("id_water").value),
        vitamins: parseFloat(document.getElementById("id_vitamins").value),
        calcium: parseFloat(document.getElementById("id_calcium").value),
        magnesium: parseFloat(document.getElementById("id_magnesium").value),
        phosphorus: parseFloat(document.getElementById("id_phosphorus").value),
        sodium: parseFloat(document.getElementById("id_sodium").value),
        potassium: parseFloat(document.getElementById("id_potassium").value),
        iron: parseFloat(document.getElementById("id_iron").value),
        zinc: parseFloat(document.getElementById("id_zinc").value),
        selenium: parseFloat(document.getElementById("id_selenium").value),
        copper: parseFloat(document.getElementById("id_copper").value),
        manganese: parseFloat(document.getElementById("id_manganese").value),
        food_img: base64Image
    };

    // API to update food details
    fetch(`https://nutrilanka.shop/nutri-lanka/update-food-record/${foodId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            alert("Food details updated successfully!");
        } else {
            alert("Failed to update food details: " + data.message);
        }
    })
    .catch(error => console.error("Error updating food details:", error));
});

document.getElementById("backButton").addEventListener("click", function () {
    window.history.back();  // Go to previous page
});
