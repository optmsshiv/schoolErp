document.addEventListener('DOMContentLoaded', function () {
  fetchFeePlansData();
});

function fetchFeePlansData() {
  const apiUrl = '../php/collectFeeStudentDetails/collection_page_fee_head.php'; // Update path as needed
  console.log('Fetching fee data from:', apiUrl); // Add log to check if the correct URL is being hit

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ status, data }) => {
      if (status !== 'success' || !Array.isArray(data) || data.length === 0) {
        console.error('No data available or an error occurred');
        showAlert('No data available to display.', 'error'); // Optional user feedback
        return;
      }

      console.log('Data received:', data); // Log the received data

      const months = [
        'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'
      ];

      // Generate the table header dynamically
      const theadRow = document.querySelector('#student_fee_table thead tr');
      theadRow.innerHTML = '<th>Fee Head</th>'; // Add "Fee Head" column

      months.forEach(month => {
        const th = document.createElement('th');
        th.textContent = month;
        theadRow.appendChild(th);
      });

      // Create a map to organize data by Fee Head and months
      const feeDataMap = {};

      data.forEach(({ fee_head_name, month_name, amount }) => {
        if (!feeDataMap[fee_head_name]) {
          feeDataMap[fee_head_name] = new Array(months.length).fill(''); // Initialize months array
        }

        const monthIndex = months.indexOf(month_name); // Get month index
        if (monthIndex !== -1) {
          feeDataMap[fee_head_name][monthIndex] = amount; // Assign the amount to the correct month
        }
      });

      console.log('Fee Data Map:', feeDataMap); // Log the map to verify data structure

      // Populate the table body dynamically
      const tableBody = document.querySelector('#student_fee_table tbody');
      tableBody.innerHTML = ''; // Clear any existing rows

      Object.entries(feeDataMap).forEach(([feeHeadName, monthAmounts]) => {
        const row = document.createElement('tr');
        row.classList.add('text-center');

        // Fee Head column
        const feeHeadCell = document.createElement('td');
        feeHeadCell.textContent = feeHeadName;
        row.appendChild(feeHeadCell);

        // Amount columns for each month
        monthAmounts.forEach(amount => {
          const amountCell = document.createElement('td');
          amountCell.textContent = amount || ''; // Leave empty if no amount
          row.appendChild(amountCell);
        });

        // Append row to the table body
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching fee plans data:', error);
      showAlert('Unable to fetch data. Please try again later.', 'error'); // Optional user feedback
    });
}

// Optional helper function to display alerts
function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
  });
}
