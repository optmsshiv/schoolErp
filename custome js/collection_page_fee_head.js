document.addEventListener('DOMContentLoaded', function () {
  const studentData = JSON.parse(sessionStorage.getItem('studentData')); // Retrieve data from session storage

  if (studentData && studentData.length > 0) {
    fetchFeePlansData(studentData);
  } else {
    console.error('No student data found in session storage.');
    showAlert('Student data is missing.', 'error');
  }
});

function fetchFeePlansData(studentData) {
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

  studentData.forEach(student => {
    const { monthly_fee } = student;

    // Populate "Monthly Fee" for all months
    if (!feeDataMap['Monthly Fee']) {
      feeDataMap['Monthly Fee'] = new Array(months.length).fill(monthly_fee);
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
        <button class="btn btn-outline-primary rounded-circle">
          <i class="bx bx-plus"></i>
        </button>
      </div>
    `;
    totalRow.appendChild(totalAmountCell);
  });

  // Append total row to the table
  tableBody.appendChild(totalRow);
}

// Optional helper function to display alerts
function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
  });
}
