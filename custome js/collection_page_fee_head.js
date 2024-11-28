document.addEventListener('DOMContentLoaded', function () {
  fetchFeePlansData();
});

function fetchFeePlansData() {
  const apiUrl = '../php/collectFeeStudentDetails/collection_page_fee_head.php'; // Update path as needed

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

      data.forEach(({ fee_head_name, month_name, amount, class_name }) => {
        if (!feeDataMap[fee_head_name]) {
          feeDataMap[fee_head_name] = new Array(months.length).fill(''); // Initialize months array
        }

        const monthIndex = months.indexOf(month_name); // Get month index
        if (monthIndex !== -1) {
          feeDataMap[fee_head_name][monthIndex] = amount; // Assign the amount to the correct month
        }
      });

      // Populate the table body dynamically
      const tableBody = document.querySelector('#student_fee_table tbody');
      tableBody.innerHTML = ''; // Clear any existing rows

      let totalAmounts = new Array(months.length).fill(0); // Array to store total amounts for each month

      Object.entries(feeDataMap).forEach(([feeHeadName, monthAmounts]) => {
        const row = document.createElement('tr');
        row.classList.add('text-center');

        // Fee Head column
        const feeHeadCell = document.createElement('td');
        feeHeadCell.textContent = feeHeadName;
        row.appendChild(feeHeadCell);

        // Amount columns for each month
        monthAmounts.forEach((amount, index) => {
          const amountCell = document.createElement('td');
          amountCell.textContent = amount || ''; // Leave empty if no amount
          row.appendChild(amountCell);

          // Add the amount to the total for that month
          if (amount && !isNaN(amount)) {
            totalAmounts[index] += parseFloat(amount);
          }
        });

        // Append row to the table body
        tableBody.appendChild(row);
      });

      // Add "Total" row with amount buttons
      const totalRow = document.createElement('tr');
      totalRow.classList.add('text-center');

      // Add "Total" cell
      const totalFeeHeadCell = document.createElement('td');
      totalFeeHeadCell.textContent = 'Total';
      totalRow.appendChild(totalFeeHeadCell);

      // Add total amounts for each month
      totalAmounts.forEach(totalAmount => {
        const totalAmountCell = document.createElement('td');
        totalAmountCell.innerHTML = `
          <div class="amount-button">
            <div class="amount">${totalAmount || ''}</div>
            <button class="btn btn-outline-success rounded-circle">
              <i class="bx bx-plus"></i>
            </button>
          </div>
        `;
        totalRow.appendChild(totalAmountCell);
      });

      // Append total row to the table
      tableBody.appendChild(totalRow);
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
