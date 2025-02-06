document.addEventListener('DOMContentLoaded', function () {
  try {
    fetchFeePlansData();
  } catch (error) {
    console.error('Error loading student data:', error);
    showAlert('Failed to load student data.', 'error');
  }

  // Handle clicks on the "Total" row's plus buttons
  document.querySelector('#student_fee_table').addEventListener('click', function (event) {
    const button = event.target.closest('.btn-outline-primary');
    if (button) {
      const cell = button.closest('td');
      const row = cell.closest('tr');
      const feeHead = row.children[0].textContent;
      const amount = Number(cell.dataset.amount) || 0;
      const month = cell.dataset.month;

      if (feeHead === 'Total' && amount > 0) {
        addToFeeCollection(month, 'Monthly Fee', amount);
        button.style.display = 'none';
      }
    }
  });

  // Handle delete button clicks in the Fee Collection table
  document.querySelector('#FeeCollection tbody').addEventListener('click', function (event) {
    const deleteButton = event.target.closest('.deleteFeeButton');
    if (deleteButton) {
      handleDeleteFee(deleteButton);
    }
  });

  // Event listener for changes in "concessionFee" to update payable amount
  document.getElementById('concessionFee').addEventListener('input', updatePayableAmount);

  // Event listener for received fee changes
  document.getElementById('recievedFee').addEventListener('input', calculateDueAndAdvanced);

  // Observe changes in the Fee Collection table to update payable amount
  const observer = new MutationObserver(updatePayableAmount);
  observer.observe(document.querySelector('#FeeCollection tbody'), { childList: true, subtree: true });
});

// Fetch fee data and populate the table
function fetchFeePlansData() {
  const months = [
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March'
  ];

  // Sample student data (Replace with AJAX/database fetch)
  const studentData = [{ user_id: 1, monthly_fee: 5000 }];

  const theadRow = document.querySelector('#student_fee_table thead tr');
  theadRow.innerHTML = '<th>Fee Head</th>'; // Reset table headers
  months.forEach(month => {
    const th = document.createElement('th');
    th.textContent = month;
    theadRow.appendChild(th);
  });

  const tableBody = document.querySelector('#student_fee_table tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  let totalAmounts = new Array(months.length).fill(0);

  studentData.forEach(student => {
    const row = document.createElement('tr');
    row.classList.add('text-center');
    row.innerHTML = `<td>Monthly Fee</td>`;

    months.forEach((month, index) => {
      const feeAmount = student.monthly_fee || 0;
      totalAmounts[index] += feeAmount;

      const cell = document.createElement('td');
      cell.textContent = feeAmount > 0 ? feeAmount.toFixed(0) : 'N/A';
      cell.dataset.amount = feeAmount;
      cell.dataset.month = month;
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  // Add "Total" row
  const totalRow = document.createElement('tr');
  totalRow.classList.add('text-center');
  totalRow.innerHTML = `<td>Total</td>`;

  totalAmounts.forEach((total, index) => {
    const totalCell = document.createElement('td');
    totalCell.dataset.amount = total;
    totalCell.dataset.month = months[index];
    totalCell.innerHTML =
      total > 0
        ? `<div class="amount-button">
                <div class="amount">${total.toFixed(0)}</div>
                <button class="btn btn-outline-primary rounded-circle">
                    <i class="bx bx-plus"></i>
                </button>
              </div>`
        : 'N/A';
    totalRow.appendChild(totalCell);
  });

  tableBody.appendChild(totalRow);
}

// Add fee to Fee Collection table
function addToFeeCollection(month, feeType, amount) {
  if (!amount || amount <= 0) return;

  const tableBody = document.querySelector('#FeeCollection tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
        <td>${month}</td>
        <td>${feeType}</td>
        <td>${amount.toFixed(2)}</td>
        <td class="text-center">
            <button class="btn text-muted deleteFeeButton" type="button">
                <i class="bx bx-trash bx-sm"></i>
            </button>
        </td>
    `;

  tableBody.appendChild(newRow);
  updatePayableAmount();
}

// Handle fee deletion with confirmation
function handleDeleteFee(deleteButton) {
  const row = deleteButton.closest('tr');
  const amount = parseFloat(row.children[2].textContent) || 0;

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(result => {
    if (result.isConfirmed) {
      row.remove();
      updatePayableAmount();
    }
  });
}

// Calculate total amount from Fee Collection table
function getTotalFromTable() {
  let total = 0;
  document.querySelectorAll('#FeeCollection tbody tr td:nth-child(3)').forEach(cell => {
    total += parseFloat(cell.textContent) || 0;
  });
  return total;
}

// Update payable amount based on table and concession fee
function updatePayableAmount() {
  const concessionFee = parseFloat(document.getElementById('concessionFee').value) || 0;
  const totalAmount = getTotalFromTable();
  document.getElementById('payableAmount').value = Math.max(totalAmount - concessionFee, 0).toFixed(2);
  calculateDueAndAdvanced();
}

// Calculate due and advanced fee
function calculateDueAndAdvanced() {
  const payableAmount = parseFloat(document.getElementById('payableAmount').value) || 0;
  const receivedFee = parseFloat(document.getElementById('recievedFee').value) || 0;

  document.getElementById('dueAmount').value = Math.max(payableAmount - receivedFee, 0).toFixed(2);
  document.getElementById('advancedFee').value = Math.max(receivedFee - payableAmount, 0).toFixed(2);
}

// Display alerts using SweetAlert
function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
    confirmButtonText: 'OK'
  });
}
