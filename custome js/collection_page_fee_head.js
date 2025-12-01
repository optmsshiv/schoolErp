document.addEventListener('DOMContentLoaded', function () {
  try {
    const studentData = JSON.parse(sessionStorage.getItem('studentData')); // Retrieve data from session storage

    if (studentData && Array.isArray(studentData) && studentData.length > 0) {
      const classId = studentData[0].class_id; // Get class name
      const userId = studentData[0].user_id; // Get user ID

      if (classId && userId) {
        fetchFeePlansData(classId, userId);
      } else {
        console.error('Class name or User ID is missing.');
        showAlert('Student data is incomplete.', 'error');
      }
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
     // let feeHead = row.children[0].textContent.trim(); // Get the Fee Head from the first column
     // const amount = cell.querySelector('.amount').textContent.trim()|| 0; // Get the amount from the clicked cell
      const month = document.querySelector(`#student_fee_table thead tr th:nth-child(${monthIndex + 1})`).textContent.trim(); // Get the month name from the header


      if (row.children[0].textContent.trim() === 'Total') {
        // Get all rows except the header & Total row
        const feeRows = document.querySelectorAll('#student_fee_table tbody tr');
        feeRows.forEach(r => {
          if (r.children[0].textContent.trim() !== 'Total') {
            const feeHead = r.children[0].textContent.trim(); // Get the Fee Head from the first column
            const amountText = r.children[monthIndex].textContent.trim();
            const amount = parseFloat(amountText).toFixed(2) || 0;

            if (amount > 0 && amountText !== 'N/A') {
              addToFeeCollection(month, feeHead, amount);
            }
          }
        });
      } else {
        const feeHead = row.children[0].textContent.trim();
        const amount = parseFloat(cell.textContent.trim()) || 0;
        if (amount > 0) {
          addToFeeCollection(month, feeHead, amount);
        }
      }

      button.style.display = 'none';
    }
  });

  function addToFeeCollection(month, feeHead, amount, concession = '', netPay = '', status = 'Pending', due = '') {
    const tableBody = document.querySelector('#FeeCollection tbody');
    const newRow = document.createElement('tr');

    const isPaid = status === 'Paid';
    const checkedAttr = isPaid ? 'checked' : '';
    const inputDisabled = isPaid ? 'disabled' : '';
    const labelClass = isPaid ? 'text-success' : 'text-danger';

    const initialConcession = concession || 0;
    const calculatedNetPay = netPay || (amount - initialConcession);
   // const calculatedDue = due || (amount - initialConcession - calculatedNetPay);
    const calculatedDue = isPaid ? 0 : (amount - initialConcession);

    newRow.innerHTML = `
    <td>${month}</td>
    <td>${feeHead}</td>
    <td><span class="originalAmount">${amount}</span></td>
    <td>
      <input type="number" class="form-control form-control-sm payableAmountInput concessionInput" value="${initialConcession}" min="0" ${inputDisabled}>
    </td>
    <td><span class="netPayValue">${calculatedNetPay.toFixed(2)}</span></td>
    <td>
      <div class="form-check form-switch">
        <input class="form-check-input statusToggle" type="checkbox" role="switch" ${checkedAttr}>
        <label class="form-check-label ${labelClass}">${isPaid ? 'Paid' : 'Pending'}</label>
      </div>
    </td>
    <td><span class="dueValue">${calculatedDue.toFixed(2)}</span></td>
    <td>
      <a href="javascript:;"  class="tf-icons text-muted deleteFeeButton" type="button">
        <i class="text-danger bx bx-trash bx-sm"></i>
      </a>
    </td>
  `;
    tableBody.appendChild(newRow);

    // Update total amount
    let totalAmount =0;
    totalAmount += parseFloat(amount); // Add the new amount to the total

    updateTotalAmount(); // Call to update the total and the payableAmount input field
    updateGrandTotals();  // Update a grand total function start form here
  }


  // Event listener for delete buttons in the Fee Collection table
  document.querySelector('#FeeCollection tbody').addEventListener('click', function (event) {

    // Check if the clicked element is a delete button
    const deleteButton = event.target.closest('.deleteFeeButton'); // Ensure the target is the button or a child of it

    if (deleteButton) {
      const row = deleteButton.closest('tr'); // Find the row the button belongs to
      const amount = parseFloat(row.children[2].textContent); // Get the amount from the row

      // Ask for confirmation using SweetAlert
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
          // Subtract the amount from totalAmount
          if (!isNaN(amount)) {
            totalAmount -= amount; // Update totalAmount
            document.querySelector('#payableAmount').value = totalAmount.toFixed(2); // Update the total input field
          }

          // Remove the row from the table
          row.remove();
          updateGrandTotals(); // <== Also update on deletion

          // Optionally: handle the plus button logic for a related table (e.g., #student_fee_table)
          const month = row.children[0].textContent; // Get the month from the row
          const monthIndex = Array.from(document.querySelectorAll('#student_fee_table thead th')).findIndex(
            th => th.textContent === month
          );

          if (monthIndex > 0) {
            // Ignore the "Fee Head" column
            const totalRow = document.querySelector('#student_fee_table tbody tr:last-child');
            const totalCell = totalRow.children[monthIndex];
            const plusButton = totalCell.querySelector('.btn-outline-primary');
            if (plusButton) {
              plusButton.style.display = 'inline-block'; // Show the plus button again
            }
          }

          // Recalculate the total after deleting the row
          updateTotalAmount();
        } else {
          Swal.fire('Cancelled', 'The fee record is safe!', 'info');
        }
      });
    }
  });
});

// function fetchFeePlansData(studentData)
async function fetchFeePlansData(classId, userId) {
  try {
    // Fetch fee plans for the class
    const feePlansResponse = await fetch(`/php/collectFeeStudentDetails/fetch_fee_month.php?class_id=${classId}`);
    const feePlans = await feePlansResponse.json();

    // Fetch paid months, previous due amount, and advanced amount
    const paidMonthsResponse = await fetch(`/php/collectFeeStudentDetails/fetch_paid_months.php?user_id=${userId}`);
    // const paidMonths = await paidMonthsResponse.json();
    const paidMonthsData = await paidMonthsResponse.json();

    if (feePlans.error || paidMonthsData.error) {
      console.error(feePlans.error || paidMonthsData.error);
      showAlert(feePlans.error || paidMonthsData.error, 'error');
      return;
    }

    updateFeeTable(feePlans, paidMonthsData.paidMonths); // Update the fee table

    // Fetch and update Previous Due Amount
    const previousDueAmount = paidMonthsData.previousDueAmount || 0; // Update the previous due amount field
    previousDueAmountField.value = previousDueAmount;

    // Fetch and update Advanced Amount
    const advancedFee = paidMonthsData.advancedFee || 0;
    advancedAmountField.value = advancedFee;
    document.getElementById("advancedAmount").value = parseFloat(advancedFee).toFixed(2);

    // Calculate and set Payable Amount
    let totalAmount = getTotalFromTable();
    let payableAmount = totalAmount + parseFloat(previousDueAmount) - parseFloat(advancedFee); // Update payable amount by adding due amount

    payableAmountField.value = payableAmount.toFixed(2);

    //  document.getElementById("payableAmount").value = payableAmount.toFixed(2);
  } catch (error) {
    console.error('Error fetching fee plans:', error);
    showAlert('Failed to load fee plans.', 'error');
  }
}

function updateFeeTable(feePlans, paidMonths) {
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

  const theadRow = document.querySelector('#student_fee_table thead tr');
  const tableBody = document.querySelector('#student_fee_table tbody');

  theadRow.innerHTML = '<th>Fee Head</th>';
  tableBody.innerHTML = '';

  // Generate the header row dynamically
  months.forEach(month => {
    const th = document.createElement('th');
    th.textContent = month;
    theadRow.appendChild(th);
  });

  const feeDataMap = {};
  feePlans.forEach(({ month_name, amount, fee_head_name }) => {
    if (!feeDataMap[fee_head_name]) {
      feeDataMap[fee_head_name] = new Array(months.length).fill('N/A');
    }
    const monthIndex = months.indexOf(month_name);
    if (monthIndex !== -1) {
      feeDataMap[fee_head_name][monthIndex] = amount;
    }
  });

  let totalAmounts = new Array(months.length).fill(0);

  // Populate the table rows for each fee head
  Object.entries(feeDataMap).forEach(([feeHeadName, monthAmounts]) => {
    const row = document.createElement('tr');
    row.classList.add('text-center');

    const feeHeadCell = document.createElement('td');
    feeHeadCell.textContent = feeHeadName;
    row.appendChild(feeHeadCell);

    monthAmounts.forEach((amount, index) => {
      const amountCell = document.createElement('td');
      amountCell.textContent = amount !== 'N/A' ? amount : 'N/A';
      row.appendChild(amountCell);

      if (amount !== 'N/A' && !isNaN(amount)) {
        totalAmounts[index] += parseFloat(amount);
      }
    });

    tableBody.appendChild(row);
  });

  // Add the "Total" row
  const totalRow = document.createElement('tr');
  totalRow.classList.add('text-center');

  const totalFeeHeadCell = document.createElement('td');
  totalFeeHeadCell.textContent = 'Total';
  totalRow.appendChild(totalFeeHeadCell);

  // Add total amounts for each month with appropriate icons
  totalAmounts.forEach((totalAmount, index) => {
    const monthName = months[index];
    const totalAmountCell = document.createElement('td');

    if (paidMonths.includes(monthName)) {
      // Show Green Tick (✔) for Paid Months
      totalAmountCell.innerHTML = `<div class="amount-button">
                <div class="amount text-success">${totalAmount > 0 ? totalAmount.toFixed(0) : 'N/A'}</div>
                  <button class="btn btn-outline-success rounded-circle" disabled>
                       <i class="bx bx-check-circle"></i>
                  </button>
                </div>`;
    } else {
      // Show Plus Button (➕) for Unpaid Months
      totalAmountCell.innerHTML = `<div class="amount-button">
                    <div class="amount">${totalAmount > 0 ? totalAmount.toFixed(0) : 'N/A'}</div>
                       <button class="btn btn-outline-primary rounded-circle">
                                <i class="bx bx-plus"></i>
                       </button>
                    </div>`;
    }

    totalRow.appendChild(totalAmountCell);
  });

  tableBody.appendChild(totalRow);
}


document.querySelector('#FeeCollection').addEventListener('input', function (event) {
  if (event.target.classList.contains('concessionInput')) {
    const row = event.target.closest('tr');
    const amount = parseFloat(row.querySelector('.originalAmount').textContent) || 0;
    const concession = parseFloat(event.target.value) || 0;

    // Calculate Net Pay and Due
    const netPay = amount - concession;
    const due = amount - concession - netPay; // Typically 0 if paid fully

    // Update DOM
    row.querySelector('.netPayValue').textContent = netPay.toFixed(2);
    row.querySelector('.dueValue').textContent = due.toFixed(2);

    updateGrandTotals(); // <== Update grand total here
  }
});


// paid toggle on off
document.querySelector('#FeeCollection').addEventListener('change', function (event) {
  if (event.target.classList.contains('statusToggle')) {
    const isChecked = event.target.checked;
    const row = event.target.closest('tr');
    const formSwitch = event.target.closest('.form-switch');
    const label = formSwitch.querySelector('.form-check-label');
    const input = event.target.closest('tr').querySelector('.payableAmountInput');

    const concessionInput = row.querySelector('.concessionInput');
    const actionColumn = row.querySelector('.deleteFeeButton')?.closest('td');

    // Update label text & color
    label.textContent = isChecked ? 'Paid' : 'Pending';
    label.classList.toggle('text-success', isChecked);
    label.classList.toggle('text-danger', !isChecked);

    // Disable/enable input based on toggle
    input.disabled = isChecked;

    // Hide or show delete button column
    if (actionColumn) {
      actionColumn.style.display = isChecked ? 'none' : '';
    }

    // Update due value
    const amount = parseFloat(row.querySelector('.originalAmount').textContent) || 0;
    const concession = parseFloat(concessionInput.value) || 0;
    const calculatedDue = amount - concession;

    // Optional: Set due to 0 if paid
    if (isChecked) {
      row.querySelector('.dueValue').textContent = '0.00';
    } else {
      row.querySelector('.dueValue').textContent = calculatedDue.toFixed(2);
    }

    // Row background color
    row.classList.toggle('table-success', isChecked); // Add greenish background for Paid
    row.classList.toggle('table-danger', !isChecked); // table-secondary = light gray

    updateGrandTotals(); // Recalculate totals
    updateActionHeaderVisibility(); // <- Check and toggle header visibility
  }
});

// Action Button usage
function updateActionHeaderVisibility() {
  const anyPending = Array.from(document.querySelectorAll('#FeeCollection tbody .statusToggle'))
    .some(toggle => !toggle.checked);

  const actionHeader = document.getElementById('actionHeader');
  const actionCells = document.querySelectorAll('#FeeCollection tbody td:last-child');
  const grandTotalAction = document.getElementById('grandTotalActionCell');

  if (anyPending) {
    // Show action column everywhere
    if (actionHeader) actionHeader.style.display = '';
    if (grandTotalAction) {
      grandTotalAction.style.display = '';
      grandTotalAction.style.border = '';
    }
    actionCells.forEach(cell => {
      cell.style.display = '';
      cell.style.border = '';
    });
  } else {
    // Hide action column everywhere
    if (actionHeader) actionHeader.style.display = 'none';
    if (grandTotalAction) {
      grandTotalAction.style.display = 'none';
      grandTotalAction.style.border = 'none';
    }
    actionCells.forEach(cell => {
      cell.style.display = 'none';
      cell.style.border = 'none';
    });
  }
}


function updateGrandTotals() {
  let totalAmount = 0;
  let totalConcession = 0;
  let totalNetPay = 0;
  let totalDue = 0;

  document.querySelectorAll('#FeeCollection tbody tr').forEach(row => {
    const amount = parseFloat(row.querySelector('.originalAmount')?.textContent || 0);
    const concession = parseFloat(row.querySelector('.concessionInput')?.value || 0);
    const netPay = parseFloat(row.querySelector('.netPayValue')?.textContent || 0);
    const due = parseFloat(row.querySelector('.dueValue')?.textContent || 0);

    totalAmount += amount;
    totalConcession += concession;
    totalNetPay += netPay;
    totalDue += due;
  });

  // Update the grand total row
  document.getElementById('grandTotalAmount').textContent = totalAmount.toFixed(2);
  document.getElementById('grandTotalConcession').textContent = totalConcession.toFixed(2);
  document.getElementById('grandTotalNetPay').textContent = totalNetPay.toFixed(2);
  document.getElementById('grandTotalDue').textContent = totalDue.toFixed(2);
}

// Function to update the total amount
function updateTotalAmount() {
  const rows = document.querySelectorAll('#FeeCollection tbody tr');
  let totalAmount = 0; // Reset the totalAmount to recalculate

  // Iterate through all rows in the table to calculate the total
  rows.forEach(row => {
    const totalCell = row.querySelector('td:nth-child(3)'); // Select the 'Total' column
    if (totalCell) {
      const amount = parseFloat(totalCell.textContent) || 0; // Parse the value or default to 0
      totalAmount += amount;
    }
  });

  // Update the payableAmount field
  document.getElementById('payableAmount').value = totalAmount.toFixed(2);
}

// Function to attach event listeners to "Total" column cells
function attachEditListeners() {
  const totalCells = document.querySelectorAll('#FeeCollection tbody tr td:nth-child(3)');
  totalCells.forEach(cell => {
    cell.removeEventListener('input', handleCellEdit); // Prevent duplicate listeners
    cell.addEventListener('input', handleCellEdit); // Attach a new listener
  });
}

// Handle cell edit event
function handleCellEdit(event) {
  const cell = event.target;
  const newValue = parseFloat(cell.textContent) || 0; // Get the new value or default to 0
  cell.textContent = newValue.toFixed(2); // Ensure the value is formatted correctly
  updateTotalAmount(); // Recalculate the total amount
}

// Add a MutationObserver to track row additions or deletions
// if any change is made to the table then must add function here
const observer = new MutationObserver(() => {
  attachEditListeners(); // Attach listeners to any new rows or cells
  updateTotalAmount(); // Ensure the total is recalculated
  updatePayableAmount(); // Ensure the payable amount is recalculated
});

// Start observing the table body for added or removed rows
observer.observe(document.querySelector('#FeeCollection tbody'), { childList: true, subtree: true });

// Initial setup
attachEditListeners(); // Attach listeners to existing cells
updateTotalAmount(); // Calculate the initial total amount

// Start observing the table body for added rows
// observer.observe(document.querySelector('#FeeCollection tbody'), { childList: true, subtree: true });

// Helper function to display alerts
function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
    confirmButtonText: 'OK'
  });
}

// Toggle visibility of payment-related fields based on Payment Status
function togglePaymentFields() {
  const paymentStatus = document.getElementById('paymentStatus').value;
  const paymentDetails = document.getElementById('paymentDetails');

  if (paymentStatus === 'paid') {
    paymentDetails.classList.remove('d-none');
  } else {
    paymentDetails.classList.add('d-none');
    document.getElementById('bankDropdown').classList.add('d-none'); // Hide Bank Dropdown if shown
  }
}

// Toggle visibility of Bank Dropdown based on Payment Type
function toggleBankDropdown() {
  const paymentType = document.getElementById('paymentType').value;
  const bankDropdown = document.getElementById('bankDropdown');

  if (paymentType === 'Account') {
    bankDropdown.classList.remove('d-none');
  } else {
    bankDropdown.classList.add('d-none');
  }
}

// Function to calculate the total amount from the Fee Collection Table
function getTotalFromTable() {
  let total = 0;
  const rows = document.querySelectorAll('#FeeCollection tbody tr');

  // Loop through each row to calculate the sum of the 3rd column (amount)
  rows.forEach(row => {
    const amountCell = row.querySelector('td:nth-child(3)'); // Assuming 3rd column contains the amounts
    if (amountCell) {
      const amount = parseFloat(amountCell.textContent) || 0;
      total += amount;
    }
  });
  return total; // Return the total amount from the table
}

const payableAmountField = document.getElementById('payableAmount');
const concessionFeeField = document.getElementById('concessionFee');
const previousDueAmountField = document.getElementById('previousDueAmount'); // Get due amount field
const advancedAmountField = document.getElementById('advancedAmount');

// Initialize the total amount from the table (dynamic calculation)
let totalAmountFromTable = getTotalFromTable();

// Function to update payable amount
function updatePayableAmount() {
  // Always fetch the latest due amount
  const dueAmount = parseFloat(previousDueAmountField.value) || 0; // Get the due amount from the field
  const advancedAmount = parseFloat(advancedAmountField.value) || 0;
  const concessionFee = parseFloat(concessionFeeField.value) || 0; // Get the current concession fee entered by the user

  totalAmountFromTable = getTotalFromTable(); // Recalculate the total amount from the table dynamically

  // Calculate the initial payable amount (before considering advance)
  let updatedPayableAmount = totalAmountFromTable + dueAmount - concessionFee;

  // If advanced amount is more than or equal to payable amount, set payable to 0
  if (advancedAmount >= updatedPayableAmount) {
    updatedPayableAmount = 0;
  } else {
    updatedPayableAmount -= advancedAmount; // Deduct advance normally
  }

  // Calculate the updated payable amount (subtract advanced amount)
  // const updatedPayableAmount = totalAmountFromTable + dueAmount - concessionFee - advancedAmount; // Calculate the updated payable amount

  // Debugging logs
/*
  console.log('===== Debugging updatePayableAmount() =====');
  console.log('Total from Table:', totalAmountFromTable);
  console.log('Previous Due Amount:', dueAmount);
  console.log('Advanced Amount:', advancedAmount);
  console.log('Concession Fee:', concessionFee);
  console.log('Updated Payable Amount:', updatedPayableAmount);
  console.log('=========================================');*/

  payableAmountField.value = updatedPayableAmount.toFixed(2);
  // payableAmountField.value = Math.max(updatedPayableAmount, 0).toFixed(2); // Update the payableAmount field and ensure it doesn't go below zero
}

// Update payableAmount when concession fee changes
concessionFeeField.addEventListener('input', updatePayableAmount);

// Recalculate payableAmount whenever the table data changes (e.g., row addition/removal)
document.querySelector('#FeeCollection tbody').addEventListener('DOMSubtreeModified', function () {
  updatePayableAmount();
  calculateDueAndAdvanced(); // Ensure due and advanced amounts update correctly
});

// Call updatePayableAmount when due amount is fetched from the server
document.addEventListener('DOMContentLoaded', function () {
  updatePayableAmount();
});

// Update due and advanced amounts based on received fee
document.getElementById('receivedFee').addEventListener('input', calculateDueAndAdvanced);

function calculateDueAndAdvanced() {
  const payableAmount = parseFloat(document.getElementById('payableAmount').value) || 0;
  const receivedFee = parseFloat(document.getElementById('receivedFee').value) || 0;

  if (receivedFee < payableAmount) {
    document.getElementById('dueAmount').value = (payableAmount - receivedFee).toFixed(2);
    document.getElementById('advancedAmount').value = 0;
  } else {
    document.getElementById('dueAmount').value = 0;
    document.getElementById('advancedAmount').value = (receivedFee - payableAmount).toFixed(2);
  }
}

document.getElementById('monthDropdown').addEventListener('click', function() {

  const monthDropdown = document.getElementById('monthDropdown');
  const dropdownMenu = document.getElementById('dropdownMenu');

// Toggle menu when clicking the dropdown label
  monthDropdown.addEventListener('click', function(e) {
    // If click is inside menu, do nothing (don't toggle)
    if (dropdownMenu.contains(e.target)) return;

    // Toggle menu visibility
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });
});
// Close the menu if clicking outside dropdown area
document.addEventListener('click', function (e) {
  if (!monthDropdown.contains(e.target)) {
    dropdownMenu.style.display = 'none';
  }
});



