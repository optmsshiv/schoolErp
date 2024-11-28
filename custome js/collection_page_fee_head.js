document.addEventListener('DOMContentLoaded', function () {
  const className = "class_name"; // Replace with dynamic class name if necessary
  fetchFeePlansData(className);
});

function fetchFeePlansData(className) {
  const apiUrl = `../php/collectFeeStudentDetails/collection_page_fee_head.php?class_name=${encodeURIComponent(className)}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ status, data }) => {
      if (status !== 'success' || !Array.isArray(data) || data.length === 0) {
        showAlert(
          `Fee generation not found for the class: ${className}. First generate the fee for this class.`,
          'error'
        );
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

      data.forEach(({ fee_head_name, month_name, amount }) => {
        if (!feeDataMap[fee_head_name]) {
          feeDataMap[fee_head_name] = new Array(months.length).fill(''); // Initialize months array
        }

        const monthIndex = months.indexOf(month_name); // Get month index
        if (monthIndex !== -1) {
          feeDataMap[fee_head_name][monthIndex] = amount; // Assign the amount to the correct month
        }
      });

      const tableBody = document.querySelector('#student_fee_table tbody');
      tableBody.innerHTML = ''; // Clear any existing rows

      let totalAmounts = new Array(months.length).fill(0); // Array to store total amounts for each month

      Object.entries(feeDataMap).forEach(([feeHeadName, monthAmounts]) => {
        const row = document.createElement('tr');
        row.classList.add('text-center');

        const feeHeadCell = document.createElement('td');
        feeHeadCell.textContent = feeHeadName;
        row.appendChild(feeHeadCell);

        monthAmounts.forEach((amount, index) => {
          const amountCell = document.createElement('td');
          amountCell.textContent = amount || ''; // Leave empty if no amount
          row.appendChild(amountCell);

          if (amount && !isNaN(amount)) {
            totalAmounts[index] += parseFloat(amount);
          }
        });

        tableBody.appendChild(row);
      });

      const totalRow = document.createElement('tr');
      totalRow.classList.add('text-center');

      const totalFeeHeadCell = document.createElement('td');
      totalFeeHeadCell.textContent = 'Total';
      totalRow.appendChild(totalFeeHeadCell);

      totalAmounts.forEach(totalAmount => {
        const totalAmountCell = document.createElement('td');
        totalAmountCell.innerHTML = `
          <div class="amount-button">
            <div class="amount">${totalAmount || ''}</div>
            <button class="btn btn-outline-primary rounded-circle">
              <i class="bx bx-plus"></i>
            </button>
          </div>
        `;
        totalRow.appendChild(totalAmountCell);
      });

      tableBody.appendChild(totalRow);
    })
    .catch(error => {
      console.error('Error fetching fee plans data:', error);
      showAlert('Unable to fetch data. Please try again later.', 'error');
    });
}

function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
  });
}
