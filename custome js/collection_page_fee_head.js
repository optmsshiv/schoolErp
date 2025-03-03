document.addEventListener('DOMContentLoaded', function () {
  try {
    const studentData = JSON.parse(sessionStorage.getItem('studentData')); // Retrieve data from session storage

    if (studentData && Array.isArray(studentData) && studentData.length > 0) {
      const className = studentData[0].class_name; // Get class name
      const userId = studentData[0].user_id; // Get user ID

      if (className && userId) {
        fetchFeePlansData(className, userId);
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

      function addToFeeCollection(month, feeType, amount) {
        const tableBody = document.querySelector('#FeeCollection tbody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
                   <td>${month}</td>
                   <td>${feeType}</td>
                   <td>${amount}</td>
                   <td class="text-center">
                     <button class="btn text-muted h-px-30 deleteFeeButton" type="button" id="deleteFeeButton">
                       <i class="btn-outline-danger bx bx-trash bx-sm"></i>
                     </button>
                   </td>
                   `;

        tableBody.appendChild(newRow);

        // Update total amount
        totalAmount += parseFloat(amount); // Add the new amount to the total
        updateTotalAmount(); // Call to update the total and the payableAmount input field
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
     async function fetchFeePlansData(className, userId) {
       try {
         // Fetch fee structure for the class
         const feePlansResponse = await fetch(`/php/collectFeeStudentDetails/fetch_fee_month.php?class_name=${className}`);
         const feePlans = await feePlansResponse.json();

         if (feePlans.error) {
           console.error(feePlans.error);
           showAlert(feePlans.error, 'error');
           return;
         }

         updateFeeTable(feePlans);
       } catch (error) {
         console.error('Error fetching fee plans:', error);
         showAlert('Failed to load fee plans.', 'error');
       }
     }

     function updateFeeTable(feePlans) {
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

       // Get table elements
       const theadRow = document.querySelector('#student_fee_table thead tr');
       const tableBody = document.querySelector('#student_fee_table tbody');

       // Clear existing table content
       theadRow.innerHTML = '<th>Fee Head</th>'; // Add "Fee Head" column
       tableBody.innerHTML = '';

       // Generate table header dynamically
       months.forEach(month => {
         const th = document.createElement('th');
         th.textContent = month;
         theadRow.appendChild(th);
       });

       // Create a map to organize data by Fee Head and months
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

       let totalAmounts = new Array(months.length).fill(0); // Track total amount for each month

       Object.entries(feeDataMap).forEach(([feeHeadName, monthAmounts]) => {
         const row = document.createElement('tr');
         row.classList.add('text-center');

         // Add Fee Head column
         const feeHeadCell = document.createElement('td');
         feeHeadCell.textContent = feeHeadName;
         row.appendChild(feeHeadCell);

         // Add amount for each month
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

       // Add "Total" row with amount buttons
       const totalRow = document.createElement('tr');
       totalRow.classList.add('text-center');

       // Add "Total" cell
       const totalFeeHeadCell = document.createElement('td');
       totalFeeHeadCell.textContent = 'Total';
       totalRow.appendChild(totalFeeHeadCell);

       // Add total amounts for each month with a button
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

       tableBody.appendChild(totalRow);
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

