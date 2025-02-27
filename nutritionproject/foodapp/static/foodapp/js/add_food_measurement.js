document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const foodId = urlParams.get("food_id");  // Extract food_id
    const foodName = urlParams.get("food_name");  // Extract food_name

    if (foodName) {
        const foodTitle = document.getElementById("selected-food-name");
        foodTitle.textContent = foodName;
        foodTitle.style.color = "#417893"; // Matches Django Admin blue link
        foodTitle.style.cursor = "pointer";
        foodTitle.style.fontWeight = "bold"; 
        
    } else {
        console.error("Food name not found in URL.");
    }

    console.log("Selected Food:", { foodId, foodName });
    // Get the measurement unit dropdown
    const dropdown = document.getElementById("measurement_unit");
    
    if (!dropdown) {
        console.error("Dropdown element with id 'measurement_unit' not found in the DOM.");
        return; 
    }

    console.log("Dropdown found, fetching data...");

    // Fetch Food Measurement Units and Populate Dropdown
    fetch("http://18.139.84.131:8002/nutri-lanka/get-food-measurement-list")
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const dropdown = document.getElementById("measurement_unit");
                dropdown.innerHTML = ""; //  Clear previous data
                
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
    
    function loadMeasurementData(foodId) {
        fetch(`http://18.139.84.131:8002/nutri-lanka/get-food-measurement-details?food_id=${foodId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    const tableBody = document.getElementById("measurement-table-body");
                    tableBody.innerHTML = "";  // Clear previous data

                    data.data.forEach((measurement) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td><input type="checkbox" class="measurement-checkbox" data-unit-id = "${measurement.unit_id}"></td>
                            <td>${measurement.unit_name}</td>
                            <td>${measurement.weight_in_grams}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    console.error("Failed to load measurement details:", data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching measurement details:", error);
            });
    }


    // Load measurement data when the page loads
    if (foodId) {
        loadMeasurementData(foodId);
    }

    // Handle Back Button Click
    document.getElementById("backButton").addEventListener("click", function () {
        window.history.back();  // Go to previous page
    });

    // Handle refersh
    document.getElementById("refreshMeasurements").addEventListener("click", function () {
        loadMeasurementData(foodId);
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
            food_id: parseInt(foodId),
            unit_id: parseInt(measurementUnit),
            weight_in_grams: parseFloat(amount)
        };

        console.log("Submitting:", payload);

        fetch("http://18.139.84.131:8002/nutri-lanka/add-food-measurements", {
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

    document.getElementById("select-all").addEventListener("change", function () {
        document.querySelectorAll(".measurement-checkbox").forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    
    document.getElementById("deleteMeasurements").addEventListener("click", function () {
        const selectedCheckboxes = Array.from(document.querySelectorAll(".measurement-checkbox:checked"));
       
        if (selectedCheckboxes.length === 0) {
            alert("Please select at least one measurement to delete.");
            return;
        }
    
        if (!confirm("Are you sure you want to delete the selected measurements?")) return;
    
        selectedCheckboxes.forEach(checkbox => {
            const unitId = checkbox.getAttribute("data-unit-id");  

            if (!unitId) {
                console.error("Error: unit_id not found for a selected checkbox.");
                return;
            }

            fetch(`http://18.139.84.131:8002/nutri-lanka/delete-food-measurement?food_id=${foodId}&unit_id=${unitId}`, {
                method: "PUT"
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    console.log(`Deleted measurement with unit_id: ${unitId}`);
                    checkbox.closest("tr").remove(); 
                } else {
                    alert(`Failed to delete measurement: ${data.message}`);
                }
            })
            .catch(error => {
                console.error("Error deleting measurement:", error);
                alert("An error occurred while deleting the measurement.");
            });
        });
    });
    
    
    
});

