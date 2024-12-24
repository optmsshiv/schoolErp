// Declare `totalAmount` in a shared scope
let totalAmount = 0;

// Function to update the total amount input field
function updatePayableAmount() {
  const payableAmountInput = document.querySelector('#payableAmount');
  if (payableAmountInput) {
    payableAmountInput.value = totalAmount.toFixed(2);
  }
}

// Function to update the totalAmount
function updateTotalAmount(amountChange) {
  const parsedAmount = parseFloat(amountChange);
  if (!isNaN(parsedAmount)) {
    totalAmount += parsedAmount; // Update the global total
    updatePayableAmount(); // Reflect changes in the UI
  } else {
    console.error(`Invalid amount change: ${amountChange}`);
  }
}

// Function to add a row to the Fee Collection table
function addToFeeCollection(month, feeType, amount) {
  const tableBody = document.querySelector('#FeeCollection tbody');
  if (!tableBody) {
    console.error("Fee Collection table body not found.");
    return;
  }

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${month}</td>
    <td>${feeType}</td>
    <td>${parseFloat(amount).toFixed(2)}</td>
    <td class="text-center">
      <button class="btn text-muted h-px-30 deleteButton" type="button">
        <i class="btn-outline-danger bx bx-trash bx-sm"></i>
      </button>
    </td>
  `;

  tableBody.appendChild(newRow);

  // Update the total
  updateTotalAmount(amount);

  // Add event listener for delete button using event delegation
  newRow.querySelector('.deleteButton').addEventListener('click', () => {
    const amount = parseFloat(newRow.children[2].textContent);
    updateTotalAmount(-amount); // Subtract from total
    newRow.remove(); // Remove the row
  });
}

// Function to add a row to the table from the offcanvas component
function addRowToTable({ feeMonth, feeType, feeAmount }) {
  const feeTableBody = document.querySelector('#FeeCollection tbody');
  if (!feeTableBody) {
    console.error("Fee table body not found.");
    return;
  }

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${feeMonth}</td>
    <td>${feeType}</td>
    <td>${parseFloat(feeAmount).toFixed(2)}</td>
    <td>
      <div class="d-flex gap-1">
        <button class="btn editFeeButton" style="margin: 0 -8px;">
          <i class="btn-outline-warning bx bx-edit bx-sm"></i>
        </button>
        <button type="button" class="btn deleteFeeButton" style="margin: 0 -8px;">
          <i class="btn-outline-danger bx bx-trash bx-sm"></i>
        </button>
      </div>
    </td>
  `;

  feeTableBody.appendChild(newRow);

  // Update the total
  updateTotalAmount(feeAmount);

  // Add Delete Button Event Listener
  newRow.querySelector('.deleteFeeButton').addEventListener('click', () => {
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
        const feeAmount = parseFloat(newRow.children[2].textContent);
        updateTotalAmount(-feeAmount); // Subtract from total
        newRow.remove(); // Remove the row
        Swal.fire("Deleted!", "The fee record has been deleted.", "success");
      }
    });
  });
}
