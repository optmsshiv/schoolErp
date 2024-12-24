document.addEventListener("DOMContentLoaded", function () {
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const payableAmountInput = document.querySelector("#payableAmount");
  let totalAmount = 0; // Shared total amount variable

  // Function to update the total amount
  const updateTotalAmount = (amountChange) => {
    totalAmount += parseFloat(amountChange);
    payableAmountInput.value = totalAmount.toFixed(2);
  };

  // Function to add data to the Fee Collection table (Source 1)
  function addToFeeCollection(month, feeType, amount) {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>${month}</td>
      <td>${feeType}</td>
      <td>${parseFloat(amount).toFixed(2)}</td>
      <td class="text-center">
        <button class="btn text-muted h-px-30" type="button" id="deleteButton">
          <i class="btn-outline-danger bx bx-trash bx-sm"></i>
        </button>
      </td>
    `;

    feeTableBody.appendChild(newRow);

    // Update total amount for this source
    updateTotalAmount(amount);

    // Add Delete Button Event Listener
    const deleteButton = newRow.querySelector("#deleteButton");
    deleteButton.addEventListener("click", () => {
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
          updateTotalAmount(-feeAmount); // Subtract the deleted fee
          newRow.remove();
          Swal.fire("Deleted!", "The fee record has been deleted.", "success");
        }
      });
    });
  }

  // Function to handle off-canvas form submission (Source 2)
  const handleSaveFee = () => {
    const feeMonth = document.getElementById("feeMonth").value.trim();
    const feeType = document.getElementById("feeType").value.trim();
    const feeAmount = parseFloat(document.getElementById("feeAmount").value.trim());

    if (!feeMonth || !feeType || isNaN(feeAmount) || feeAmount <= 0) {
      Swal.fire("Error", "Please fill out all fields correctly.", "error");
      return;
    }

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${feeMonth}</td>
      <td>${feeType}</td>
      <td>${feeAmount.toFixed(2)}</td>
      <td>
        <button class="btn deleteFeeButton">
          <i class="btn-outline-danger bx bx-trash bx-sm"></i>
        </button>
      </td>
    `;
    feeTableBody.appendChild(newRow);

    // Update total amount for this source
    updateTotalAmount(feeAmount);

    // Reset form and close off-canvas
    document.getElementById("feeForm").reset();
    bootstrap.Offcanvas.getInstance(document.getElementById("addFeeCanvas")).hide();

    // Add Delete Button Event Listener
    const deleteButton = newRow.querySelector(".deleteFeeButton");
    deleteButton.addEventListener("click", () => {
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
          updateTotalAmount(-feeAmount); // Subtract the deleted fee
          newRow.remove();
          Swal.fire("Deleted!", "The fee record has been deleted.", "success");
        }
      });
    });
  };
});
