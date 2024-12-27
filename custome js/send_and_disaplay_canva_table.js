document.addEventListener("DOMContentLoaded", function () {
  const feeTypeDropdown = document.getElementById("feeType");
  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeForm = document.getElementById("feeForm");
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const addFeeCanvasEl = document.getElementById("addFeeCanvas");
  const payableAmountInput = document.getElementById("payableAmount");
  let isSaveButtonClicked = false;
  let totalAmount = 0; // Initialize totalAmount

  // Initialize Offcanvas
  const addFeeCanvas = bootstrap.Offcanvas.getInstance(addFeeCanvasEl) || new bootstrap.Offcanvas(addFeeCanvasEl);
  if (!addFeeCanvas) {
    console.error('Element with ID "addFeeCanvas" not found');
    return;
  }

  // Fetch fee heads and populate the dropdown
  const fetchFeeHeads = async (retryCount = 3, delayMs = 1000) => {
    feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
    try {
      const response = await fetch("/php/feeCanva/fetch_canva_feeHead.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      if (result.status !== 'success' || !Array.isArray(result.data)) {
        throw new Error("Invalid response structure or no data.");
      }

      // Populate dropdown
      const feeheads = result.data;
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>';
      feeheads.forEach(({ fee_head_id, fee_head_name }) => {
        if (fee_head_id && fee_head_name) {
          const option = document.createElement("option");
          option.value = fee_head_id;
          option.textContent = fee_head_name;
          feeTypeDropdown.appendChild(option);
        }
      });
    } catch (error) {
      console.error("Error fetching fee types:", error);
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Error loading fee types</option>';

      if (retryCount > 0) {
        console.warn(`Retrying... Attempts left: ${retryCount}`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        await fetchFeeHeads(retryCount - 1, delayMs);
      } else {
        Swal.fire("Error", "Failed to load fee types after multiple attempts.", "error");
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
    const feeMonthElement = document.getElementById("feeMonth");
    const feeAmountElement = document.getElementById("feeAmount");

    if (!feeMonthElement || !feeAmountElement) {
      console.error("Required form elements are missing!");
      return { isValid: false, message: "Form validation failed." };
    }

    const feeMonth = capitalize(feeMonthElement.value.trim());
    const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text || '';
    const feeAmount = feeAmountElement.value.trim();

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

    // Update totalAmount
    totalAmount += parseFloat(feeAmount);  // Add the new amount to the total
    updateTotalAmount();                   // Update the payableAmount field

    // Function to update the total amount
    function updateTotalAmount() {
      const rows = document.querySelectorAll("#FeeCollection tbody tr");
      totalAmount = 0; // Reset the totalAmount to recalculate

      rows.forEach(row => {
        const totalCell = row.querySelector("td:nth-child(3)"); // Select the 'Total' column
        if (totalCell) {
          const amount = parseFloat(totalCell.textContent) || 0; // Parse the value or default to 0
          totalAmount += amount; // Add to the totalAmount
        }
      });

      // Update the payableAmount field
      document.getElementById("payableAmount").value = totalAmount.toFixed(2);
    }

    // Add Delete Button Event Listener
    const deleteButton = newRow.querySelector(".deleteFeeButton");
    if (deleteButton) {
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
          console.log("Swal Result:", result); // Debugging line to check the result
          if (result.isConfirmed) {
            const feeAmount = parseFloat(newRow.children[2].textContent);

            if (!isNaN(feeAmount)) {
              // Update the total amount by subtracting the fee
              updateTotalAmount(-feeAmount);
            }

            // Remove the row after confirmation
            newRow.remove();

            Swal.fire("Deleted!", "The fee record has been deleted.", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelled", "The fee record is safe!", "info");
          }
        }).catch((error) => {
          console.error("Swal Error:", error);
        });
      });
    }

    // Add Edit Button Event Listener
    const editButton = newRow.querySelector(".editFeeButton");
    editButton.addEventListener("click", () => handleEditFee(newRow));
  };

  // Update total amount
  const updateTotalAmount = (amountChange) => {
    totalAmount += amountChange;
    payableAmountInput.value = totalAmount.toFixed(2);
  };

  // Handle Edit Fee

  // <label for="editFeeType" class="form-label">Fee Type</label>
  // <select id="editFeeType" class="swal2-select">${feeTypeDropdown.innerHTML}</select>
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
      <select id="editFeeType" class="swal2-select">
        ${Array.from(feeTypeDropdown.options)
          .map(
            (option) => `
              <option value="${option.value}" ${option.textContent.trim() === feeTypeCell.textContent.trim() ? "selected" : ""
              }>
                ${option.textContent}
              </option>
            `
          )
          .join("")}
      </select>

      <label for="editFeeAmount" class="form-label">Fee Amount</label>
      <input id="editFeeAmount" class="swal2-input" type="number" value="${feeAmountCell.textContent}">
    `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const editedFeeMonth = capitalize(document.getElementById("editFeeMonth").value.trim());
        const editFeeTypeSelect = document.getElementById("editFeeType");
        const editedFeeType = editFeeTypeSelect.options[editFeeTypeSelect.selectedIndex].text;
        const editedFeeAmount = parseFloat(document.getElementById("editFeeAmount").value.trim());

        if (!editedFeeMonth || !editedFeeType || isNaN(editedFeeAmount) || editedFeeAmount <= 0) {
          Swal.showValidationMessage("Please fill out all fields correctly.");
          return false;
        }

        return { editedFeeMonth, editedFeeType, editedFeeAmount };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const oldFeeAmount = parseFloat(feeAmountCell.textContent);
        const { editedFeeMonth, editedFeeType, editedFeeAmount } = result.value;

        feeMonthCell.textContent = editedFeeMonth;
        feeTypeCell.textContent = editedFeeType;
        feeAmountCell.textContent = editedFeeAmount;

        // Update totalAmount with the difference
        updateTotalAmount(editedFeeAmount - oldFeeAmount);

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
