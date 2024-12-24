(() => {
  // Declare totalAmount in a shared scope (global within this function scope)
  let totalAmount = 0;

  // Function to update the total amount input field
  function updatePayableAmount() {
    document.querySelector('#payableAmount').value = totalAmount.toFixed(2); // Display the total with 2 decimal places
  }

  // Function to update the totalAmount
  function updateTotalAmount(amountChange) {
    totalAmount += amountChange; // Add or subtract the amount
    updatePayableAmount(); // Reflect changes in the input field
  }

  // Modified addToFeeCollection function
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

    // Update the total amount by adding the fee amount
    updateTotalAmount(parseFloat(amount));

    // Add event listener for delete button
    newRow.querySelector('#deleteButton').addEventListener('click', () => {
      const amount = parseFloat(newRow.children[2].textContent); // Get amount from the row
      updateTotalAmount(-amount); // Subtract from total when row is deleted
      newRow.remove(); // Remove the row from the table
    });
  }

  // Modified addRowToTable function (from Offcanvas or other source)
  function addRowToTable({ feeMonth, feeType, feeAmount }) {
    const feeTableBody = document.querySelector('#FeeCollection tbody'); // Ensure this selector matches the actual table body
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${feeMonth}</td>
      <td>${feeType}</td>
      <td>${feeAmount}</td>
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

    // Update the total amount by adding the fee amount from this source
    updateTotalAmount(parseFloat(feeAmount));

    // Add Delete Button Event Listener
    newRow.querySelector('.deleteFeeButton').addEventListener('click', () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          const feeAmount = parseFloat(newRow.children[2].textContent); // Get feeAmount from row
          updateTotalAmount(-feeAmount); // Subtract the fee amount from the total
          newRow.remove(); // Remove the row from the table
          Swal.fire('Deleted!', 'The fee record has been deleted.', 'success');
        }
      });
    });
  }

  // Expose the functions globally for testing or calling outside this scope
  window.addToFeeCollection = addToFeeCollection;
  window.addRowToTable = addRowToTable;
})();
