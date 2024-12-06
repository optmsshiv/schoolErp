document.addEventListener("DOMContentLoaded", function () {
  const feeTypeDropdown = document.getElementById("feeType");
  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeForm = document.getElementById("feeForm");
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const addFeeCanvasEl = document.getElementById("addFeeCanvas");
  let isSaveButtonClicked = false;

  const addFeeCanvas = bootstrap.Offcanvas.getInstance(addFeeCanvasEl) || new bootstrap.Offcanvas(addFeeCanvasEl);

  // Fetch fee heads and populate the dropdown
  const fetchFeeHeads = async (retryCount = 3) => {
    feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
    try {
      const response = await fetch("../php/feeCanva/fetch_canva_feeHead.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Check if the response data is valid
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No data received or invalid response format.");
      }

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

      if (retryCount > 0) {
        console.warn(`Retrying... Attempts left: ${retryCount}`);
        await fetchFeeHeads(retryCount - 1); // Retry fetching fee heads
      } else {
        feeTypeDropdown.innerHTML = '<option value="" disabled selected>Error loading fee types</option>';
        Swal.fire("Error", "Failed to load fee types. Please try again later.", "error");
      }
    }
  };

  // Utility function to capitalize the first letter of each word
  const capitalize = (str) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Validate form fields
  const validateForm = () => {
    const feeMonth = capitalize(document.getElementById("feeMonth").value.trim());
    const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text || '';
    const feeAmount = document.getElementById("feeAmount").value.trim();

    if (!feeMonth) {
      return { isValid: false, message: "Please select a valid month." };
    }

    if (!feeType || feeTypeDropdown.value === "") {
      return { isValid: false, message: "Please select a fee type." };
    }

    if (!feeAmount || isNaN(feeAmount) || Number(feeAmount) <= 0) {
      return { isValid: false, message: "Please enter a valid fee amount." };
    }

    return { isValid: true, feeMonth, feeType, feeAmount };
  };

  // Handle Save Fee button click
  const handleSaveFee = () => {
    isSaveButtonClicked = true;

    const { isValid, message, ...data } = validateForm();
    if (isValid) {
      addRowToTable(data);

      feeForm.reset();
      addFeeCanvas.hide();

      Swal.fire({
        title: "Success",
        text: "Fee details added successfully.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => Swal.showLoading(),
      });
    } else {
      Swal.fire("Error", message, "error");
    }

    isSaveButtonClicked = false;
  };

  // Add a new row to the FeeCollection table
  const addRowToTable = ({ feeMonth, feeType, feeAmount }) => {
    const newRow = document.createElement("tr");

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

    // Update Total Payable Amount
    updatePayableAmount();// Call this function to update the total payable amount


    const deleteButton = newRow.querySelector(".deleteFeeButton");
   // deleteButton.addEventListener("click", () => newRow.remove());
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
        newRow.remove();
        Swal.fire("Deleted!", "The fee record has been deleted.", "success");
      }
    });
  });

    // Add Edit Button Event Listener
    const editButton = newRow.querySelector(".editFeeButton");
    editButton.addEventListener("click", () => handleEditFee(newRow));
  };

  const updatePayableAmount = () => {
  const rows = feeTableBody.querySelectorAll("tr");
  let totalFee = 0;

  rows.forEach((row) => {
    const feeAmount = parseFloat(row.children[2].textContent.trim());
    if (!isNaN(feeAmount)) {
      totalFee += feeAmount;
    }
  });

  // Update the payableAmount input field
  document.getElementById("payableAmount").value = totalFee.toFixed(2);
};


  // Handle Edit Fee
  const handleEditFee = (row) => {
    const feeMonthCell = row.children[0];
    const feeTypeCell = row.children[1];
    const feeAmountCell = row.children[2];

    Swal.fire({
      title: "Edit Fee Details",
      html: `
        <label for="editFeeMonth" class="form-label">Fee Month</label>
        <input id="editFeeMonth" class="swal2-input" value="${capitalize(feeMonthCell.textContent)}">

        <label for="editFeeType" class="form-label">Fee Type</label>
        <input id="editFeeType" class="swal2-input" value="${feeTypeCell.textContent}">

        <label for="editFeeAmount" class="form-label">Fee Amount</label>
        <input id="editFeeAmount" class="swal2-input" type="number" value="${feeAmountCell.textContent}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const editedFeeMonth = capitalize(document.getElementById("editFeeMonth").value.trim());
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

        feeMonthCell.textContent = editedFeeMonth;
        feeTypeCell.textContent = editedFeeType;
        feeAmountCell.textContent = editedFeeAmount;

        Swal.fire("Updated!", "Fee details have been updated successfully.", "success");
      }
    });
  };

  // Handle Offcanvas Hide Event
  addFeeCanvasEl.addEventListener("hide.bs.offcanvas", (event) => {
    if (!isSaveButtonClicked) {
      feeForm.reset();
    }
  });

  // Initialize event listeners
  const initialize = () => {
    fetchFeeHeads();
    saveFeeButton.addEventListener("click", handleSaveFee);
  };

  initialize();
});
