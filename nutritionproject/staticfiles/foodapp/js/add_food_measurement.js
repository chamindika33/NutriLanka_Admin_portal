document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded"); // Debugging message

    // Get the measurement unit dropdown
    const dropdown = document.getElementById("measurement_unit");
    
    if (!dropdown) {
        console.error("Dropdown element with id 'measurement_unit' not found in the DOM.");
        return; // Exit function if dropdown is missing
    }

    console.log("Dropdown found, fetching data...");

    // Fetch Food Measurement Units and Populate Dropdown
    fetch("http://127.0.0.1:8002/nutri-lanka/get-food-measurement-list")
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const dropdown = document.getElementById("measurement_unit");
                dropdown.innerHTML = ""; // Clear loading message
                
                data.data.forEach(unit => {
                    const option = document.createElement("option");
                    option.value = unit.unit_id; // Store unit_id as value
                    option.textContent = unit.unit_name; // Display unit name
                    dropdown.appendChild(option);
                });
            } else {
                console.error("Failed to load measurement units:", data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching measurement units:", error);
        });

    // Handle Form Submission
    document.getElementById("submitMeasurement").addEventListener("click", function () {
        const measurementUnit = document.getElementById("measurement_unit").value;
        const amount = document.getElementById("amount").value;

        if (!measurementUnit) {
            alert("Please select a measurement unit.");
            return;
        }

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const payload = {
            food_id: 0, // Change this if you get the real food_id
            unit_id: parseInt(measurementUnit),
            weight_in_grams: parseFloat(amount)
        };

        console.log("Submitting:", payload);

        fetch("http://127.0.0.1:8002/nutri-lanka/add-food-measurements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                alert("Measurement saved successfully!");
            } else {
                alert("Failed to save measurement: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error saving measurement:", error);
            alert("An error occurred while saving the measurement.");
        });
    });
});
