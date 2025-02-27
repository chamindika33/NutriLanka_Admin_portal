console.log("DOM fully loaded and parsed");
const apiUrl = "http://18.139.84.131:8002/nutri-lanka/all-food-records"; 
const recordPerPage = 12;
let currentPage = 1;

    function loadFoodData(pageNumber) {
        const payload = {
            page_number: pageNumber,
            record_per_page: recordPerPage,
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                  } else {
                    console.error("Error fetching data:", response.statusText);
                    alert("An error occurred while loading the data.");
                    throw new Error("Failed to fetch data");
                  }
                })
           
            .then((data) => {
                console.log("Parsed JSON:", data);
                if (data.status) {
                    console.log("Fetched Data:", data);
                    populateTable(data.data.data);
                    updatePagination(data.data.page_number, data.data.record_per_page, data.data["No of records"]);
                } else {
                    alert("Failed to load data: " + data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                alert("An error occurred while loading the data.");
            });
    }

    function populateTable(records) {
        console.log("inside the populate table:", records);
        const tableBody = document.getElementById("result_list");
        if (!tableBody) {
            console.error("Table body element with id 'food-table-body' not found in the DOM.");
            return;
        }
        tableBody.innerHTML = ""; // Clear existing rows

        records.forEach((record) => {
            console.log("food name:", record.food_name);
            const row = document.createElement("tr");
            row.innerHTML = `
                <tr>
                    <td class="action-checkbox">
                        <input type="checkbox" name="_selected_action" value="${record.id}" class="action-select" aria-label="Select this object for an action - ${record.food_name}">
                    </td>
                    <th class="field-__str__">
                        <a href="/admin/add-food-measurement/?food_id=${record.food_id}&food_name=${encodeURIComponent(record.food_name)}" class="food-link">
                            ${record.food_name}
                        </a>
                    </th>
                </tr>
               
            `;
            tableBody.appendChild(row);
        });
    }

    function updatePagination(currentPage, recordsPerPage, totalRecords) {
        const paginationDiv = document.querySelector(".paginator");
        if (!paginationDiv) {
            console.error("Pagination container not found in the DOM.");
            return;
        }
        paginationDiv.innerHTML = ""; // Clear existing pagination

        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        const stepLinks = document.createElement("span");
        stepLinks.classList.add("step-links");

        if (currentPage > 1) {
            const prevLink = document.createElement("a");
            prevLink.href = "#";
            prevLink.textContent = "Previous";
            prevLink.addEventListener("click", (e) => {
                e.preventDefault();
                loadFoodData(currentPage - 1);
            });
            stepLinks.appendChild(prevLink);
        }

        const currentSpan = document.createElement("span");
        currentSpan.classList.add("current");
        currentSpan.textContent = ` Page ${currentPage} of ${totalPages} `;
        stepLinks.appendChild(currentSpan);

        if (currentPage < totalPages) {
            const nextLink = document.createElement("a");
            nextLink.href = "#";
            nextLink.textContent = "Next";
            nextLink.addEventListener("click", (e) => {
                e.preventDefault();
                loadFoodData(currentPage + 1);
            });
            stepLinks.appendChild(nextLink);
        }

        paginationDiv.appendChild(stepLinks);
    }

    loadFoodData(currentPage); // Initial load

