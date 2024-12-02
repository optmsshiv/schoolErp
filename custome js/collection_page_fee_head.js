document.addEventListener('DOMContentLoaded', function () {
  try {
    const studentData = JSON.parse(sessionStorage.getItem('studentData')); // Retrieve data from session storage

    if (studentData && Array.isArray(studentData) && studentData.length > 0) {
      fetchFeePlansData(studentData);
    } else {
      console.error('No valid student data found in session storage.');
      showAlert('Student data is missing or invalid.', 'error');
    }
  } catch (error) {
    console.error('Error parsing student data:', error);
    showAlert('Failed to load student data.', 'error');
  }

  // Event listener for the "plus" button in the Total cell
  document.querySelector('#student_fee_table').addEventListener('click', function (event) {
    if (event.target.closest('.btn-outline-primary')) {
      const button = event.target.closest('.btn-outline-primary');
      const cell = button.closest('td'); // Get the cell containing the button
      const monthIndex = Array.from(cell.parentNode.children).indexOf(cell); // Find the month index
      const feeType = 'Monthly Fee'; // Default fee type to "Monthly Fee"
      const totalAmount = cell.querySelector('.amount').textContent; // Get the total amount
      const month = document.querySelector(`#student_fee_table thead tr th:nth-child(${monthIndex + 1})`).textContent;

      // Add the data to the Fee Collection table
      addToFeeCollection(month, feeType, totalAmount);
    }
  });

  // Event listener for delete buttons in the Fee Collection table
  document.querySelector('#FeeCollection tbody').addEventListener('click', function (event) {
    if (event.target.closest('#deleteButton')) {
      const row = event.target.closest('tr');
      row.remove(); // Remove the row from the table
    }
  });
});

function fetchFeePlansData(studentData) {
  const months = [
    'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
    'January', 'February', 'March'
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
      feeDataMap['Monthly Fee'] = new Array(months.length).fill(monthly_fee || 'N/A'); // Default to N/A if fee is not available
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
      amountCell.textContent = amount !== 'N/A' && amount ? amount : 'N/A'; // Display N/A if no amount
      row.appendChild(amountCell);

      // Add the amount to the total for that month (only if it's numeric)
      if (amount && !isNaN(amount)) {
        totalAmounts[index] += parseFloat(amount);
      }
    });

    // Append row to the table body
    tableBody.appendChild(row);
  });

  // Add "Total" row with an add button in each cell
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
        <div class="amount">${totalAmount > 0 ? totalAmount.toFixed(0) : 'N/A'}</div>
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

// Function to add data to the Fee Collection table
function addToFeeCollection(month, feeType, amount) {
  const tableBody = document.querySelector('#FeeCollection tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${month}</td>
    <td>${feeType}</td>
    <td>${amount}</td>
    <td class="text-center">
      <button class="btn text-muted h-px-30" type="button" id="deleteButton">
        <i class="bx bx-trash bx-sm"></i>
      </button>
    </td>
  `;

  tableBody.appendChild(newRow);
}

// Helper function to display alerts
function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
    confirmButtonText: 'OK',
  });
}

// Helper function to toggle bank dropdown visibility
function toggleBankDropdown() {
  const paymentType = document.getElementById("paymentType").value;
  const bankDropdown = document.getElementById("bankDropdown");
  bankDropdown.style.display = paymentType === "bank" ? "block" : "none";
}
