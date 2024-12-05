 // Fetch Feeheads from the server
 fetch('../php/feeCanva/fetch_canva_feeHead.php')
 .then(response => response.json())
 .then(data => {
   const feeTypeDropdown = document.getElementById('feeType');
   feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>'; // Clear default option

   // Populate options dynamically
   data.forEach(feehead => {
     const option = document.createElement('option');
     option.value = feehead.id;
     option.textContent = feehead.fee_head_name;
     feeTypeDropdown.appendChild(option);
   });
 })
 .catch(error => {
   console.error('Error fetching fee types:', error);
   const feeTypeDropdown = document.getElementById('feeType');
   feeTypeDropdown.innerHTML = '<option value="" disabled selected>Error loading fee types</option>';
 });

 // send data to table
document.addEventListener("DOMContentLoaded", function () {
  const saveFeeButton = document.getElementById("saveFeeButton");

  // Handle Save Fee Button Click
  saveFeeButton.addEventListener("click", function () {
    const feeMonth = document.getElementById("feeMonth").value;
    const feeTypeDropdown = document.getElementById('feeType');
    const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text || '';
    const feeAmount = document.getElementById("feeAmount").value;

    if (feeMonth && feeType && feeAmount) {
      // Reference the FeeCollection table's body
      const feeTableBody = document.querySelector("#FeeCollection tbody");

      // Create a new row
      const newRow = document.createElement("tr");

      // Add cells with the entered data
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

      // Append the new row to the FeeCollection table
      feeTableBody.appendChild(newRow);

      // Clear the form fields in the canvas
      document.getElementById("feeForm").reset();

      // Add event listener for the delete button
      newRow.querySelector(".deleteFeeButton").addEventListener("click", function () {
        newRow.remove(); // Remove the row from the table
      });

      // Close the offcanvas (if desired)
      const addFeeCanvas = bootstrap.Offcanvas.getInstance(document.getElementById("addFeeCanvas"));
      if (addFeeCanvas) {
        addFeeCanvas.hide();
      }
    } else {
      alert("Please fill out all fields before saving.");
    }
  });
});


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
