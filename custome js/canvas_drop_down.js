

 /*
// Handle Save Fee button click
document.getElementById('saveFeeButton').addEventListener('click', function (e) {
  e.preventDefault();

  // Get form values
  const feeTypeDropdown = document.getElementById('feeType');
  const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text || '';
  const feeAmount = document.getElementById('feeAmount').value;
  const feeMonth = document.getElementById('feeMonth').value;

  // Validate inputs
  if (!feeType || !feeAmount || !feeMonth) {
    alert('Please fill out all required fields.');
    return;
  }

  // Get FeeCollection table body
  const feeTableBody = document.querySelector('#FeeCollection tbody');

  // Create a new row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${feeMonth}</td>
    <td>${feeType}</td>
    <td>${feeAmount}</td>
    <td>
      <button type="button" class="btn btn-danger btn-sm deleteFeeButton">
        <i class="bx bx-trash"></i>
      </button>
    </td>
  `;

  // Append new row to the table
  feeTableBody.appendChild(newRow);

  // Add delete functionality
  newRow.querySelector('.deleteFeeButton').addEventListener('click', function () {
    newRow.remove();
  });

  // Reset form
  document.getElementById('feeForm').reset();

  // Optionally close the offcanvas
  const offcanvasInstance = bootstrap.Offcanvas.getInstance(document.getElementById('addFeeCanvas'));
  if (offcanvasInstance) {
    offcanvasInstance.hide();
  }
});
*/
