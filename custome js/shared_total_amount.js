(() => {
  // Declare totalAmount in a shared scope
  let totalAmount = 0;

  // Function to update the total amount input field
  function updatePayableAmount() {
    document.querySelector('#payableAmount').value = totalAmount.toFixed(2);
  }

  // Function to update the totalAmount
  function updateTotalAmount(amountChange) {
    totalAmount += amountChange; // Update the global total
    updatePayableAmount(); // Reflect changes in the UI
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

    // Update the total
    updateTotalAmount(parseFloat(amount));

    // Add event listener for delete button
    newRow.querySelector('#deleteButton').addEventListener('click', () => {
      const amount = parseFloat(newRow.children[2].textContent); // Get amount
      updateTotalAmount(-amount); // Subtract from total
      newRow.remove(); // Remove the row
    });
  }

  // Modified addRowToTable function from Offcanvas
  function addRowToTable({ feeMonth, feeType, feeAmount }) {
    const feeTableBody = document.querySelector('#FeeCollection tbody'); // Ensure selector matches
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

    // Update the total
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
          const feeAmount = parseFloat(newRow.children[2].textContent);
          updateTotalAmount(-feeAmount); // Subtract from total
          newRow.remove(); // Remove the row
          Swal.fire('Deleted!', 'The fee record has been deleted.', 'success');
        }
      });
    });
  }

  // Expose functions if needed globally
  window.addToFeeCollection = addToFeeCollection;
  window.addRowToTable = addRowToTable;
})();
