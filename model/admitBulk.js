// Get form and loading indicator elements
const studentBulkDataForm = document.getElementById('studentBulkData');
const processButton = document.getElementById('processButton');
const submitButton = document.getElementById('submitButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const fileInput = document.getElementById('inputGroupFile01');
const dataTableBody = document.querySelector('#dataTable tbody');

// Hide loading indicator initially
loadingIndicator.style.display = 'none';

// Process button - read CSV file and populate table
processButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a CSV file first.');
        return;
    }

    // Show loading indicator during processing
    loadingIndicator.style.display = 'block';

    const reader = new FileReader();
    reader.onload = (event) => {
        const rows = event.target.result.split('\n').map(row => row.split(','));

        // Clear any existing table rows
        dataTableBody.innerHTML = '';

        // Add rows to the table
        rows.forEach((cells, index) => {
            if (cells.length < 21) return; // Skip incomplete rows

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${cells[0]}</td>
                <td>${cells[1]}</td>
                <td>${cells[2]}</td>
                <td>${cells[3]}</td>
                <td>${cells[4]}</td>
                <td>${cells[5]}</td>
                <td>${cells[6]}</td>
                <td>${cells[7]}</td>
                <td>${cells[8]}</td>
                <td>${cells[9]}</td>
                <td>${cells[10]}</td>
                <td>${cells[11]}</td>
                <td>${cells[12]}</td>
                <td>${cells[13]}</td>
                <td>${cells[14]}</td>
                <td>${cells[15]}</td>
                <td>${cells[16]}</td>
                <td>${cells[17]}</td>
                <td>${cells[18]}</td>
                <td>${cells[19]}</td>
            `;
            dataTableBody.appendChild(row);
        });

        // Hide loading indicator after processing
        loadingIndicator.style.display = 'none';
    };

    reader.readAsText(file);
});

// Submit button - send table data to the server
studentBulkDataForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    // Show loading indicator during data submission
    loadingIndicator.style.display = 'block';

    // Collect table data
    const rows = [];
    dataTableBody.querySelectorAll('tr').forEach(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.innerText);
        rows.push(cells);
    });

    // Send data to server
    fetch('../php/admit_bulk_submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: rows })
    })
    .then(response => response.json())
    .then(data => {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
        if (data.success) {
            alert('Data uploaded successfully!');
            studentBulkDataForm.reset();
            dataTableBody.innerHTML = ''; // Clear table
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
        console.error('Error:', error);
        alert('An error occurred while uploading the data.');
    });
});
