document.addEventListener("DOMContentLoaded", function () {
  const feeTypeDropdown = document.getElementById("feeType");
  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeForm = document.getElementById("feeForm");
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const canvasContainer = document.getElementById("canvas-container");
  let isSaveButtonClicked = false;

  // Dynamically append the offcanvas HTML structure to #canvas-container
  if (canvasContainer) {
    canvasContainer.innerHTML = `
      <div class="offcanvas offcanvas-end" tabindex="-1" id="addFeeCanvas" aria-labelledby="addFeeCanvasLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="addFeeCanvasLabel">Add Fee</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <form id="feeForm">
          <div class="mb-3">
              <label for="feeType" class="form-label">Fee Type</label>
              <select class="form-select" id="feeType">
                <option value="" disabled selected>Select Fee Type</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="feeMonth" class="form-label">Fee Month</label>
              <select id="feeMonth" name="feeMonth" class="form-select" required>
                   <option value="" disabled selected>Select Month</option>
                   <option value="january">January</option>
                   <option value="february">February</option>
                   <option value="march">March</option>
                   <option value="april">April</option>
                   <option value="may">May</option>
                   <option value="june">June</option>
                   <option value="july">July</option>
                   <option value="august">August</option>
                   <option value="september">September</option>
                   <option value="october">October</option>
                   <option value="november">November</option>
                   <option value="december">December</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="feeAmount" class="form-label">Fee Amount</label>
              <input type="number" class="form-control" id="feeAmount" placeholder="Enter Fee Amount">
            </div>

              <div class="mb-3">
                <label for="remarks">Remarks</label>
                <textarea id="remarks" name="remarks" class="form-control" rows="3" placeholder="Optional"></textarea>
              </div>
            <button type="button" id="saveFeeButton" class="btn btn-primary">Save</button>
          </form>
        </div>
      </div>`;
  } else {
    console.error("Canvas container element not found.");
    return;
  }

  const addFeeCanvasEl = document.getElementById("addFeeCanvas");

  // Initialize Offcanvas
  const addFeeCanvas = bootstrap.Offcanvas.getInstance(addFeeCanvasEl) || new bootstrap.Offcanvas(addFeeCanvasEl);

  // Fetch fee heads and populate the dropdown
  const fetchFeeHeads = async (retryCount = 3, delayMs = 1000) => {
  const feeTypeDropdown = document.getElementById("feeType");
  if (!feeTypeDropdown) {
    console.error("Fee type dropdown element not found.");
    return;
  }

  feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
  try {
    const response = await fetch("../php/feeCanva/fetch_canva_feeHead.php");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();

    // Check response structure
    if (result.status === "success" && Array.isArray(result.data) && result.data.length > 0) {
      // Populate dropdown
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>';
      result.data.forEach((feehead) => {
        if (feehead.fee_head_id && feehead.fee_head_name) {
          const option = document.createElement("option");
          option.value = feehead.fee_head_id;
          option.textContent = feehead.fee_head_name;
          feeTypeDropdown.appendChild(option);
        } else {
          console.warn("Skipping invalid fee head entry:", feehead);
        }
      });
    } else {
      console.error("No valid fee heads received:", result);
      throw new Error(result.message || "No valid data received.");
    }
  } catch (error) {
    console.error("Error fetching fee types:", error.message);

    // Retry logic
    if (retryCount > 0) {
      console.warn(`Retrying... Attempts left: ${retryCount}`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      await fetchFeeHeads(retryCount - 1, delayMs);
    } else {
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Error loading fee types</option>';
      Swal.fire("Error", "Failed to load fee types after multiple attempts. Please try again later.", "error");
    }
  }
};


  // Validate form fields
  const validateForm = () => {
    const feeMonthElement = document.getElementById("feeMonth");
    const feeAmountElement = document.getElementById("feeAmount");
    const feeTypeDropdown = document.getElementById("feeType");

    if (!feeMonthElement || !feeAmountElement || !feeTypeDropdown) {
      return { isValid: false, message: "Required form elements are missing!" };
    }

    const feeMonth = feeMonthElement.value.trim();
    const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text || '';
    const feeAmount = feeAmountElement.value.trim();

    if (!feeMonth) return { isValid: false, message: "Please select a valid month." };
    if (!feeType || feeTypeDropdown.value === "") return { isValid: false, message: "Please select a fee type." };
    if (!feeAmount || isNaN(feeAmount) || Number(feeAmount) <= 0) return { isValid: false, message: "Please enter a valid fee amount." };

    return { isValid: true, feeMonth, feeType, feeAmount };
  };

  // Handle Save Fee button click
  const handleSaveFee = () => {
    isSaveButtonClicked = true;

    const { isValid, message, feeMonth, feeType, feeAmount } = validateForm();
    if (isValid) {
      addRowToTable({ feeMonth, feeType, feeAmount });

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
          <button class="btn editFeeButton">
            <i class="btn-outline-warning bx bx-edit bx-sm"></i>
          </button>
          <button type="button" class="btn deleteFeeButton">
            <i class="btn-outline-danger bx bx-trash bx-sm"></i>
          </button>
        </div>
      </td>
    `;

    feeTableBody.appendChild(newRow);
  };

  // Initialize event listeners
  const initialize = () => {
    fetchFeeHeads();
    saveFeeButton.addEventListener("click", handleSaveFee);
  };

  initialize();
});
