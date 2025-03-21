document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://18.139.84.131:8002/nutri-lanka/get-all-users-dietary-data";
    const apiDietaryUrl = "https://nutrilanka.shop/nutri-lanka/get-dietary-report-filter";
    const reportTableBody = document.getElementById("report-table-body");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    const exportReportBtn = document.getElementById("exportReportCSV");
    const pdfReportBtn = document.getElementById("exportReport");
    const filterDropdown = document.getElementById("filter-achieved");

    let currentPage = 1;
    const recordsPerPage = 10;

    //  Fetch and Render Report Data
    function loadReportData(filterValue = "all", pageNumber = 1) {
        let fetchUrl = apiUrl;  // Default: Fetch all data
        let payload = { page_number: pageNumber, record_per_page: recordsPerPage };

        if (filterValue !== "all") {
            fetchUrl = apiDietaryUrl;  // Switch to dietary API
            payload = { 
                filter_name: "status", 
                status: filterValue === "true", // Convert string to boolean
                page_number: pageNumber, 
                record_per_page: recordsPerPage 
            };
        }

        fetch(fetchUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
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

        records.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.gole_id}</td>
                <td>${user.user_id}</td>
                <td>${user.target_nutrient}</td>
                <td>${user.target_value}</td>
                <td>${user.breakfast_burn}</td>
                <td>${user.lunch_burn}</td>
                <td>${user.intermediate_burn}</td>
                <td>${user.dinner_burn}</td>
                <td>${user.is_achieved}</td>
                <td>${user.created_at}</td>
                <td>${user.updated_at}</td>
               
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

    filterDropdown.addEventListener("change", function () {
        loadReportData(this.value,currentPage);
    });

    //  Listeners for Pagination
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadReportData(filterDropdown.value,currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        loadReportData(currentPage);
    });

    //  CSV Export
    exportReportBtn.addEventListener("click", () => {
        window.location.href = "/admin/export-dietary-csv/"; 
    });

       //  pdfExport
    pdfReportBtn.addEventListener("click", () => {
        window.location.href = "/admin/export-user-dietary-pdf/"; 
    });

    //  Initial Load
    loadReportData("all",currentPage);
});

document.getElementById("backButton").addEventListener("click", function () {
    window.history.back();  // Go to previous page
});
