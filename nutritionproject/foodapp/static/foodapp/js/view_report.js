document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://18.139.84.131:8002/nutri-lanka/all-food-records";
    const reportTableBody = document.getElementById("report-table-body");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    const exportReportBtn = document.getElementById("exportReportCSV");

    let currentPage = 1;
    const recordsPerPage = 10;

    //  Fetch and Render Report Data
    function loadReportData(pageNumber) {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page_number: pageNumber, record_per_page: recordsPerPage })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                renderTable(data.data.data);
                updatePagination(pageNumber, data.data["No of records"]);
            } else {
                console.error("Failed to load data:", data.message);
            }
        })
        .catch(error => console.error("Error fetching data:", error));
    }

    //  Render Table Data
    function renderTable(records) {
        reportTableBody.innerHTML = "";  // Clear existing rows

        records.forEach(food => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${food.food_id}</td>
                <td>${food.food_name}</td>
                <td>${food.native_name}</td>
                <td>${food.description}</td>
                <td>${food.calories}</td>
                <td>${food.water}</td>
                <td>${food.protein}</td>
                <td>${food.carbohydrates}</td>
                <td>${food.fat}</td>
                <td>${food.fiber}</td>
                <td>${food.iron}</td>
                <td>${food.sodium}</td>
                <td>${food.calcium}</td>
                <td>${food.magnesium}</td>
                <td>${food.phosphorus}</td>
                <td>${food.potassium}</td>
                <td>${food.zinc}</td>
                <td>${food.vitamins}</td>
                <td>${food.selenium}</td>
                <td>${food.manganese}</td>
            `;
            reportTableBody.appendChild(row);
        });
    }

    // Handle Pagination
    function updatePagination(current, totalRecords) {
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        pageInfo.textContent = `Page ${current} of ${totalPages}`;

        prevPageBtn.disabled = current === 1;
        nextPageBtn.disabled = current === totalPages;
    }

    //  Listeners for Pagination
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadReportData(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        loadReportData(currentPage);
    });

    //  CSV Export
    exportReportBtn.addEventListener("click", () => {
        window.location.href = "/admin/export-csv/"; 
    });

    //  Initial Load
    loadReportData(currentPage);
});
