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

  // Event listener for the "plus" buttons in the "Total" row
  document.querySelector('#student_fee_table').addEventListener('click', function (event) {
    if (event.target.closest('.btn-outline-primary')) {
      const button = event.target.closest('.btn-outline-primary');
      const cell = button.closest('td'); // Get the cell containing the button
      const row = cell.closest('tr'); // Get the parent row
      const monthIndex = Array.from(row.children).indexOf(cell); // Find the month index
      const feeHead = row.children[0].textContent; // Get the Fee Head from the first column
      const amount = cell.querySelector('.amount').textContent; // Get the amount from the clicked cell

      // Get the month name from the header
      const month = document.querySelector(`#student_fee_table thead tr th:nth-child(${monthIndex + 1})`).textContent;

      // If the clicked row is the "Total" row, use the first Fee Head ("Monthly Fee")
      if (feeHead === 'Total') {
        const monthlyFeeType = 'Monthly Fee'; // The fee type from the first fee head
        addToFeeCollection(month, monthlyFeeType, amount); // Add to Fee Collection table

        // Hide the plus button
        button.style.display = 'none';
      }
    }
  });

  // Event listener for delete buttons in the Fee Collection table
  document.querySelector('#FeeCollection tbody').addEventListener('click', function (event) {
    if (event.target.closest('#deleteButton')) {
      const row = event.target.closest('tr');
      const amount = parseFloat(row.children[2].textContent); // Get the amount from the row

      // Subtract the amount from totalAmount
      if (!isNaN(amount)) {
        totalAmount -= amount;
        document.querySelector('#payableAmount').value = totalAmount.toFixed(2); // Update the total amount input field
      }

      const month = row.children[0].textContent; // Get the month from the row
      row.remove(); // Remove the row from the table

      // Find the corresponding plus button in the Total row and show it
      const monthIndex = Array.from(document.querySelectorAll('#student_fee_table thead th')).findIndex(
        th => th.textContent === month
      );

      if (monthIndex > 0) { // Ignore the "Fee Head" column
        const totalRow = document.querySelector('#student_fee_table tbody tr:last-child');
        const totalCell = totalRow.children[monthIndex];
        const plusButton = totalCell.querySelector('.btn-outline-primary');
        if (plusButton) {
          plusButton.style.display = 'inline-block'; // Show the plus button again
        }
      }
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

    // Amount columns for each month (No button here for monthly fee)
    monthAmounts.forEach((amount, index) => {
      const amountCell = document.createElement('td');
      amountCell.textContent = amount !== 'N/A' && amount ? amount : 'N/A'; // Show amount if available
      row.appendChild(amountCell);

      // Add the amount to the total for that month (only if it's numeric)
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

  // Add total amounts for each month with the plus button
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

// Variable to keep track of the total
let totalAmount = 0;

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
        <i class="btn-outline-danger bx bx-trash bx-sm"></i>
      </button>
    </td>
  `;

  tableBody.appendChild(newRow);

  // Update total amount
  totalAmount += parseFloat(amount); // Add the new amount to the total
  updateTotalAmount(); // Call to update the total and the payableAmount input field
}

// Function to update the total amount
function updateTotalAmount() {
  const rows = document.querySelectorAll("#FeeCollection tbody tr");
  totalAmount = 0; // Reset the totalAmount to recalculate

  // Iterate through all rows in the table to calculate the total
  rows.forEach(row => {
    const totalCell = row.querySelector("td:nth-child(3)"); // Select the 'Total' column
    if (totalCell) {
      const amount = parseFloat(totalCell.textContent) || 0; // Parse the value or default to 0
      totalAmount += amount;
    }
  });

  // Update the payableAmount field
  document.getElementById("payableAmount").value = totalAmount.toFixed(2);
}

// Event listener to detect changes in the Total column
document.querySelector('#FeeCollection').addEventListener('input', function (event) {
  if (event.target.classList.contains('totalAmountCell')) {
    updateTotalAmount(); // Update the total when the Total column is modified
  }
});

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

  if (paymentType === "bank") {
    bankDropdown.classList.remove("d-none");
  } else {
    bankDropdown.classList.add("d-none");
  }
}

