document.addEventListener('DOMContentLoaded', function () {
  const studentData = JSON.parse(sessionStorage.getItem('studentData')); // Retrieve student data from sessionStorage

  if (studentData && studentData.length > 0) {
    populateFeeTable(studentData);
  } else {
    console.error('No student data found in session storage.');
    showAlert('Student data is missing.', 'error');
  }
});

function populateFeeTable(studentData) {
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

  // Populate the table body dynamically
  const tableBody = document.querySelector('#student_fee_table tbody');
  tableBody.innerHTML = ''; // Clear any existing rows

  let totalAmounts = new Array(months.length).fill(0); // Array to store total amounts for each month

  // Loop through student data to populate rows
  studentData.forEach(student => {
    const row = document.createElement('tr');
    row.classList.add('text-center');

    // Add Fee Head column
    const feeHeadCell = document.createElement('td');
    feeHeadCell.textContent = "Monthly Fee"; // Fixed Fee Head for monthly fees
    row.appendChild(feeHeadCell);

    // Add the monthly fee amount to each month column
    months.forEach((_, index) => {
      const amountCell = document.createElement('td');
      const monthlyFee = parseFloat(student.monthly_fee || 0); // Use monthly_fee from session storage
      amountCell.textContent = monthlyFee;

      row.appendChild(amountCell);

      // Update total for the month
      totalAmounts[index] += monthlyFee;
    });

    // Append the row to the table
    tableBody.appendChild(row);
  });

  // Add "Total" row to display totals for each month
  const totalRow = document.createElement('tr');
  totalRow.classList.add('text-center');

  // Add "Total" cell
  const totalCell = document.createElement('td');
  totalCell.textContent = "Total";
  totalRow.appendChild(totalCell);

  // Add total amounts for each month
  totalAmounts.forEach(totalAmount => {
    const totalAmountCell = document.createElement('td');
    totalAmountCell.textContent = totalAmount;
    totalRow.appendChild(totalAmountCell);
  });

  // Append the total row to the table
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
