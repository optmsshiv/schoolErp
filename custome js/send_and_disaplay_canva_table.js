document.addEventListener("DOMContentLoaded", function () {
  const saveFeeButton = document.getElementById("saveFeeButton");

  saveFeeButton.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent form submission

    // Get input values
    const feeMonth = document.getElementById("feeMonth").value;
    const feeType = document.getElementById("feeType").value;
    const feeAmount = document.getElementById("feeAmount").value;

    // Validate inputs
    if (!feeMonth || !feeType || !feeAmount) {
      alert("Please fill all the fields!");
      return;
    }

    // Find the FeeCollection table
    const feeTableBody = document.querySelector("#FeeCollection tbody");

    // Create a new row and populate it
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

    // Clear the form
    document.getElementById("feeForm").reset();

    // Add delete functionality
    newRow.querySelector(".deleteFeeButton").addEventListener("click", function () {
      newRow.remove();
    });

    // Optionally close the offcanvas
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(document.getElementById("addFeeCanvas"));
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  });
});
