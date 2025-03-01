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
    // Check if the clicked element is a delete button
    const deleteButton = event.target.closest('.deleteFeeButton'); // Ensure the target is the button or a child of it

    if (deleteButton) {
      const row = deleteButton.closest('tr'); // Find the row the button belongs to
      const amount = parseFloat(row.children[2].textContent); // Get the amount from the row

      // Ask for confirmation using SweetAlert
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Subtract the amount from totalAmount
          if (!isNaN(amount)) {
            totalAmount -= amount; // Update totalAmount
            document.querySelector('#payableAmount').value = totalAmount.toFixed(2); // Update the total input field
          }

          // Remove the row from the table
          row.remove();

          // Optionally: handle the plus button logic for a related table (e.g., #student_fee_table)
          const month = row.children[0].textContent; // Get the month from the row
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

          // Recalculate the total after deleting the row
          updateTotalAmount();
        } else {
          Swal.fire("Cancelled", "The fee record is safe!", "info");
        }
      });
    }
  });
});

    // function fetchFeePlansData(studentData)
    function fetchFeePlansData(user_id) {
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

      // Fetch data from the database
      fetch(`/php/collectFeeStudentDetails/fetch_fee_month.php?user_id=${encodeURIComponent(user_id)}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error(data.error);
            return;
          }

          const { monthly_fee, paid_status } = data;

          // Generate table header dynamically
          const theadRow = document.querySelector('#student_fee_table thead tr');
          theadRow.innerHTML = '<th>Fee Head</th>'; // "Fee Head" column

          months.forEach(month => {
            const th = document.createElement('th');
            th.textContent = month;
            theadRow.appendChild(th);
          });

          // Table Body
          const tableBody = document.querySelector('#student_fee_table tbody');
          tableBody.innerHTML = ''; // Clear any existing rows

          // Row for Monthly Fee
          const row = document.createElement('tr');
          row.classList.add('text-center');

          const feeHeadCell = document.createElement('td');
          feeHeadCell.textContent = 'Monthly Fee';
          row.appendChild(feeHeadCell);

          months.forEach(month => {
            const amountCell = document.createElement('td');

            if (paid_status[month] === '1') {
              // Show Green Tick for Paid Months
              amountCell.innerHTML = `<span class="text-success fw-bold">✔</span>`;
            } else {
              // Show Plus Button for Unpaid Months
              amountCell.innerHTML = `
            <div class="amount-button">
              <div class="amount">${monthly_fee}</div>
              <button class="btn btn-outline-primary rounded-circle payFeeBtn" data-month="${month}" data-amount="${monthly_fee}">
                <i class="bx bx-plus"></i>
              </button>
            </div>
          `;
            }
            row.appendChild(amountCell);
          });

          // Append row to the table
          tableBody.appendChild(row);

          // Attach Event Listeners to Plus Buttons
          document.querySelectorAll('.payFeeBtn').forEach(button => {
            button.addEventListener('click', function () {
              const month = this.dataset.month;
              const amount = this.dataset.amount;
              addToFeeCollection(month, 'Monthly Fee', amount);
            });
          });
        })
        .catch(error => console.error('Error fetching fee data:', error));
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
      <button class="btn text-muted h-px-30 deleteFeeButton" type="button">
        <i class="btn-outline-danger bx bx-trash bx-sm"></i>
      </button>
    </td>
  `;

  tableBody.appendChild(newRow);

  // Hide plus button & Show Green Tick
  const button = document.querySelector(`button[data-month="${month}"]`);
  if (button) {
    button.parentElement.innerHTML = `<span class="text-success fw-bold">✔</span>`;
  }
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
//document.querySelector('#FeeCollection').addEventListener('input', function (event) {
//  if (event.target.classList.contains('totalAmountCell')) {
//    updateTotalAmount(); // Update the total when the Total column is modified
//  }
//});
// Function to attach event listeners to "Total" column cells
function attachEditListeners() {
  const totalCells = document.querySelectorAll("#FeeCollection tbody tr td:nth-child(3)");
  totalCells.forEach(cell => {
    cell.removeEventListener("input", handleCellEdit); // Prevent duplicate listeners
    cell.addEventListener("input", handleCellEdit); // Attach a new listener
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
const observer = new MutationObserver(() => {
  attachEditListeners(); // Attach listeners to any new rows or cells
  updateTotalAmount(); // Ensure the total is recalculated
});

// Start observing the table body for added or removed rows
observer.observe(document.querySelector("#FeeCollection tbody"), { childList: true, subtree: true });

// Initial setup
attachEditListeners(); // Attach listeners to existing cells
updateTotalAmount(); // Calculate the initial total amount


// Start observing the table body for added rows
observer.observe(document.querySelector("#FeeCollection tbody"), { childList: true, subtree: true });

// Helper function to display alerts
function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
    confirmButtonText: 'OK',
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
  const rows = document.querySelectorAll("#FeeCollection tbody tr");

  // Loop through each row to calculate the sum of the 3rd column (amount)
  rows.forEach(row => {
    const amountCell = row.querySelector("td:nth-child(3)"); // Assuming 3rd column contains the amounts
    if (amountCell) {
      const amount = parseFloat(amountCell.textContent) || 0;
      total += amount;
    }
  });

  return total; // Return the total amount from the table
}

// Get references to important elements
const payableAmountField = document.getElementById('payableAmount');
const concessionFeeField = document.getElementById('concessionFee');

// Initialize the total amount from the table (dynamic calculation)
let totalAmountFromTable = getTotalFromTable();

// Update payableAmount on concession fee change
concessionFeeField.addEventListener('input', function () {
  // Get the current concession fee entered by the user
  const concessionFee = parseFloat(this.value) || 0;

  // Recalculate the total amount from the table dynamically
  totalAmountFromTable = getTotalFromTable();

  // Calculate the updated payable amount
  const updatedPayableAmount = totalAmountFromTable - concessionFee;

  // Update the payableAmount field and ensure it doesn't go below zero
  payableAmountField.value = Math.max(updatedPayableAmount, 0).toFixed(2);
});

// Recalculate the payableAmount whenever the table data changes (e.g., row addition/removal)
document.querySelector('#FeeCollection tbody').addEventListener('DOMSubtreeModified', function () {
  // Recalculate the total amount from the table
  totalAmountFromTable = getTotalFromTable();

  // Get the current concession fee (if any)
  const concessionFee = parseFloat(concessionFeeField.value) || 0;

  // Update the payable amount based on the updated table total and concession fee
  const updatedPayableAmount = totalAmountFromTable - concessionFee;
  payableAmountField.value = Math.max(updatedPayableAmount, 0).toFixed(2);

  // Recalculate due and advanced amounts
  calculateDueAndAdvanced();
});

// Update due and advanced amounts based on received fee
document.getElementById('recievedFee').addEventListener('input', calculateDueAndAdvanced);

function calculateDueAndAdvanced() {
  const payableAmount = parseFloat(document.getElementById('payableAmount').value) || 0;
  const receivedFee = parseFloat(document.getElementById('recievedFee').value) || 0;

  if (receivedFee < payableAmount) {
    document.getElementById('dueAmount').value = (payableAmount - receivedFee).toFixed(2);
    document.getElementById('advancedFee').value = 0;
  } else {
    document.getElementById('dueAmount').value = 0;
    document.getElementById('advancedFee').value = (receivedFee - payableAmount).toFixed(2);
  }
}

