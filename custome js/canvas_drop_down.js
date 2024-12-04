document.addEventListener("DOMContentLoaded", function () {
  // Load Fee Types into the dropdown
  const feeTypeDropdown = document.getElementById("feeType");
  fetch("../php/feeCanva/fetch_canva_feeHead.php") // Replace with your endpoint for fetching fee types
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>';
        data.forEach(item => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.fee_head_name;
          feeTypeDropdown.appendChild(option);
        });
      } else {
        feeTypeDropdown.innerHTML = '<option value="" disabled>No Fee Types Available</option>';
      }
    })
    .catch(error => {
      console.error("Error loading fee types:", error);
      feeTypeDropdown.innerHTML = '<option value="" disabled>Error Loading Fee Types</option>';
    });

  // Handle Save Fee button click
  const saveFeeButton = document.getElementById("saveFeeButton");
  saveFeeButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Get form values
    const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text;
    const feeAmount = document.getElementById("feeAmount").value;
    const feeMonth = document.getElementById("feeMonth").value;
    const remarks = document.getElementById("remarks").value;

    // Validate inputs
    if (!feeType || !feeAmount || !feeMonth) {
      alert("Please fill out all required fields.");
      return;
    }

    // Find the FeeCollection table
    const feeTableBody = document.querySelector("#FeeCollection tbody");

    // Create a new row
    const newRow = document.createElement("tr");
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

    // Append the new row to the table
    feeTableBody.appendChild(newRow);

    // Add delete functionality
    newRow.querySelector(".deleteFeeButton").addEventListener("click", function () {
      newRow.remove();
    });

    // Reset the form
    document.getElementById("feeForm").reset();

    // Optionally close the offcanvas
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(document.getElementById("addFeeCanvas"));
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  });
});
