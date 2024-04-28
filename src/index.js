document.addEventListener('DOMContentLoaded', () => {
    const dataTable = document.getElementById('dataTable');
    const tableBody = document.getElementById('tableBody');
    const salaryFilter = document.getElementById('salaryFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const genderFilter = document.getElementById('genderFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    let currentPage = 1;
    const pageSize = 10; // Number of items per page

    let filteredData = [];

    const fetchAndDisplayData = () => {
        fetch('http://localhost:3000/data')
            .then(response => response.json())
            .then(data => {
                filteredData = data;
                applyFiltersAndPagination();
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const applyFiltersAndPagination = () => {
        const salaryOrder = salaryFilter.value === 'lowToHigh' ? 1 : -1;
        const department = departmentFilter.value;
        const gender = genderFilter.value;

        const filtered = filteredData.filter(item => {
            let passSalary = true;
            let passDepartment = true;
            let passGender = true;

            if (salaryOrder === 1) {
                passSalary = item.salary >= 50000;
            } else {
                passSalary = item.salary < 50000;
            }

            if (department !== 'all') {
                passDepartment = item.department === department;
            }

            if (gender !== 'all') {
                passGender = item.gender === gender;
            }

            return passSalary && passDepartment && passGender;
        });

        const totalPages = Math.ceil(filtered.length / pageSize);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);

        displayData(paginatedData);
    };

    const displayData = (data) => {
        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.salary}</td>
                <td>${item.department}</td>
                <td>${item.gender}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    // Initial fetch and display
    fetchAndDisplayData();

    // Event listeners for filters
    salaryFilter.addEventListener('change', applyFiltersAndPagination);
    departmentFilter.addEventListener('change', applyFiltersAndPagination);
    genderFilter.addEventListener('change', applyFiltersAndPagination);

    // Pagination event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            applyFiltersAndPagination();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            applyFiltersAndPagination();
        }
    });
});