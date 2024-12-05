document.addEventListener("DOMContentLoaded", function () {
  const feeTypeDropdown = document.getElementById("feeType");
  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeForm = document.getElementById("feeForm");
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const addFeeCanvas = bootstrap.Offcanvas.getInstance(document.getElementById("addFeeCanvas"));

  // Fetch fee heads and populate the dropdown
  const fetchFeeHeads = async () => {
    try {
      const response = await fetch("../php/feeCanva/fetch_canva_feeHead.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Populate dropdown options
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>';
      data.forEach((feehead) => {
        const option = document.createElement("option");
        option.value = feehead.id;
        option.textContent = feehead.fee_head_name;
        feeTypeDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching fee types:", error);
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Error loading fee types</option>';
    }
  };

  // Validate form fields
  const validateForm = () => {
    const feeMonth = document.getElementById("feeMonth").value.trim();
    const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text || '';
    const feeAmount = document.getElementById("feeAmount").value.trim();

    if (!feeMonth) {
      alert("Please select a valid month.");
      return false;
    }

    if (!feeType || feeTypeDropdown.value === "") {
      alert("Please select a fee type.");
      return false;
    }

    if (!feeAmount || isNaN(feeAmount) || Number(feeAmount) <= 0) {
      alert("Please enter a valid fee amount.");
      return false;
    }

    return { feeMonth, feeType, feeAmount };
  };

  // Add a new row to the FeeCollection table
  const addRowToTable = ({ feeMonth, feeType, feeAmount }) => {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>${feeMonth}</td>
      <td>${feeType}</td>
      <td>${feeAmount}</td>
      <td>
        <button type="button" class="btn btn-warning btn-sm editFeeButton">
          <i class="bx bx-edit"></i>
        </button>
        <button type="button" class="btn btn-danger btn-sm deleteFeeButton">
          <i class="bx bx-trash"></i>
        </button>
      </td>
    `;

    feeTableBody.appendChild(newRow);

    // Add event listener to the delete button
    const deleteButton = newRow.querySelector(".deleteFeeButton");
    deleteButton.addEventListener("click", () => newRow.remove());

    // Add event listener to the edit button
    const editButton = newRow.querySelector(".editFeeButton");
    editButton.addEventListener("click", () => handleEditFee(newRow));
  };

  // Handle Edit Fee
  const handleEditFee = (row) => {
    const feeMonthCell = row.children[0];
    const feeTypeCell = row.children[1];
    const feeAmountCell = row.children[2];

    // Show Swal with pre-filled values
    Swal.fire({
      title: "Edit Fee Details",
      html: `
        <label for="editFeeMonth" class="form-label">Fee Month</label>
        <input id="editFeeMonth" class="swal2-input" value="${feeMonthCell.textContent}">

        <label for="editFeeType" class="form-label">Fee Type</label>
        <input id="editFeeType" class="swal2-input" value="${feeTypeCell.textContent}">

        <label for="editFeeAmount" class="form-label">Fee Amount</label>
        <input id="editFeeAmount" class="swal2-input" type="number" value="${feeAmountCell.textContent}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const editedFeeMonth = document.getElementById("editFeeMonth").value.trim();
        const editedFeeType = document.getElementById("editFeeType").value.trim();
        const editedFeeAmount = document.getElementById("editFeeAmount").value.trim();

        if (!editedFeeMonth || !editedFeeType || !editedFeeAmount || isNaN(editedFeeAmount) || Number(editedFeeAmount) <= 0) {
          Swal.showValidationMessage("Please fill out all fields correctly.");
          return false;
        }

        return { editedFeeMonth, editedFeeType, editedFeeAmount };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { editedFeeMonth, editedFeeType, editedFeeAmount } = result.value;

        // Update row data
        feeMonthCell.textContent = editedFeeMonth;
        feeTypeCell.textContent = editedFeeType;
        feeAmountCell.textContent = editedFeeAmount;

        Swal.fire("Updated!", "Fee details have been updated successfully.", "success");
      }
    });
  };

  
// Handle Save Fee button click
const handleSaveFee = () => {
  const validatedData = validateForm();
  if (validatedData) {
    addRowToTable(validatedData);

    // Reset the form and prevent validation alert during offcanvas hide
    feeForm.reset();

    // Close the offcanvas (if desired)
    const addFeeCanvas = bootstrap.Offcanvas.getInstance(document.getElementById("addFeeCanvas"));
    if (addFeeCanvas) {
      // Temporarily disable validation to prevent alert on hiding
      feeForm.classList.add("no-validation");
      addFeeCanvas.hide();
      setTimeout(() => feeForm.classList.remove("no-validation"), 300); // Re-enable validation after hiding
    }

    // Show a success alert
    Swal.fire("Success", "Fee details added successfully.", "success");
  } else {
    // Show error alert if validation fails
    Swal.fire("Error", "Please fill out all fields before saving.", "error");
  }
};

 // Initialize event listeners
  const initialize = () => {
    fetchFeeHeads();

    saveFeeButton.addEventListener("click", handleSaveFee);
  };

  initialize();
});
