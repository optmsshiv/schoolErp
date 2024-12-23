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
/******************************************************** */

document.addEventListener("DOMContentLoaded", function () {
  const feeTypeDropdown = document.getElementById("feeType");
  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeForm = document.getElementById("feeForm");
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const addFeeCanvasEl = document.getElementById("addFeeCanvas");
  let isSaveButtonClicked = false; // Track if Save button was clicked

  const addFeeCanvas = bootstrap.Offcanvas.getInstance(addFeeCanvasEl) || new bootstrap.Offcanvas(addFeeCanvasEl);

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
    isSaveButtonClicked = true; // Mark save button as clicked

    const { isValid, message, ...data } = validateForm();
    if (isValid) {
      addRowToTable(data);

      // Reset the form
      feeForm.reset();

      // Close the offcanvas
      addFeeCanvas.hide();

      // Show a success alert (optional)
      Swal.fire("Success", "Fee details added successfully.", "success");
    } else {
      Swal.fire("Error", message, "error");
    }

    isSaveButtonClicked = false; // Reset after action
  };

  // Handle Offcanvas Hide Event
  addFeeCanvasEl.addEventListener("hide.bs.offcanvas", (event) => {
    if (!isSaveButtonClicked) {
      // Prevent validation alert during offcanvas hiding
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

/****************************************** */
const fetchFeeHeads = async (retryCount = 3) => {
    feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
    try {
      const response = await fetch("../php/feeCanva/fetch_canva_feeHead.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No valid data received.");
      }

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
      if (retryCount > 0) {
        await fetchFeeHeads(retryCount - 1);
      } else {
        Swal.fire("Error", "Failed to load fee types. Please try again later.", "error");
      }
    }
  };

  /****************************************** */

  document.addEventListener("DOMContentLoaded", function () {
  const feeTypeDropdown = document.getElementById("feeType");
  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeForm = document.getElementById("feeForm");
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const addFeeCanvasEl = document.getElementById("addFeeCanvas");
  let isSaveButtonClicked = false;

  // Check if required elements exist
  if (!feeTypeDropdown || !saveFeeButton || !feeForm || !feeTableBody || !addFeeCanvasEl) {
    console.error("Required elements are missing from the DOM.");
    return;
  }

  // Initialize Offcanvas
  const addFeeCanvas = bootstrap.Offcanvas.getInstance(addFeeCanvasEl) || new bootstrap.Offcanvas(addFeeCanvasEl);

  // Fetch fee heads and populate the dropdown
  const fetchFeeHeads = async (retryCount = 3, delayMs = 1000) => {
    feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
    try {
      const response = await fetch("/php/feeCanva/fetch_canva_feeHead.php");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Validate response data
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No valid data received.");
      }

      // Populate dropdown
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>';
      data.forEach((feehead) => {
        if (feehead.fee_head_id && feehead.fee_head_name) {
          const option = document.createElement("option");
          option.value = feehead.fee_head_id;
          option.textContent = feehead.fee_head_name;
          feeTypeDropdown.appendChild(option);
        } else {
          console.warn("Skipping invalid fee head entry:", feehead);
        }
      });
    } catch (error) {
      console.error("Error fetching fee types:", error);

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

  // Utility function to capitalize the first letter of each word
  const capitalize = (str) =>
    str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  // Validate form fields
  const validateForm = () => {
    const feeMonthElement = document.getElementById("feeMonth");
    const feeAmountElement = document.getElementById("feeAmount");

    if (!feeMonthElement || !feeAmountElement) {
      return { isValid: false, message: "Required form elements are missing!" };
    }

    const feeMonth = capitalize(feeMonthElement.value.trim());
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

    // Add Delete Button Event Listener
    newRow.querySelector(".deleteFeeButton").addEventListener("click", () => {
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
    newRow.querySelector(".editFeeButton").addEventListener("click", () => handleEditFee(newRow));
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
  addFeeCanvasEl.addEventListener("hide.bs.offcanvas", () => {
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


/*balck box code*/

document.addEventListener("DOMContentLoaded", function () {
  const feeTypeDropdown = document.getElementById("feeType");
  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeForm = document.getElementById("feeForm");
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const addFeeCanvasEl = document.getElementById("addFeeCanvas");
  let isSaveButtonClicked = false;

  // Check if addFeeCanvasEl exists
  if (!addFeeCanvasEl) {
    console.error('Element with ID "addFeeCanvas" not found');
    return; // Exit if the element is not found
  }

  // Initialize Offcanvas
  const addFeeCanvas = bootstrap.Offcanvas.getInstance(addFeeCanvasEl) || new bootstrap.Offcanvas(addFeeCanvasEl);

  // Fetch fee heads and populate the dropdown
  const fetchFeeHeads = async (retryCount = 3, delayMs = 1000) => {
    feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
    try {
      const response = await fetch("../php/feeCanva/fetch_canva_feeHead.php");
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
    if (!feeAmount || isNaN(feeAmount) || Number(feeAmount) <= 0 ) {
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
          newRow.remove();
          Swal.fire("Deleted!", "The fee record has been deleted.", "success");
        }
      });
    });

    // Add Edit Button Event Listener
    const editButton = newRow.querySelector(".editFeeButton");
    editButton.addEventListener("click", () => handleEditFee(newRow));
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
        <select id="editFeeType" class="swal2-select">${feeTypeDropdown.innerHTML}</select>

        <label for="editFeeAmount" class="form-label">Fee Amount</label>
        <input id="editFeeAmount" class="swal2-input" type="number" value="${feeAmountCell.textContent}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const editedFeeMonth = capitalize(document.getElementById("editFeeMonth").value.trim());
        const editedFeeType = document.getElementById("editFeeType").options[document.getElementById("editFeeType").selectedIndex].text;
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
/*
```javascript
const fetchFeeHeads = async (retryCount = 3, delayMs = 1000) => {
  feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
  // Show loading spinner
  const loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'spinner-border';
  loadingSpinner.setAttribute('role', 'status');
  feeTypeDropdown.parentNode.insertBefore(loadingSpinner, feeTypeDropdown);

  try {
    const response = await fetch("../php/feeCanva/fetch_canva_feeHead.php");
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
  } finally {
    // Remove loading spinner
    loadingSpinner.remove();
  }
};
/* html canva*/
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Offcanvas Example</title>
</head>
<body>

    <!-- Button to trigger Offcanvas -->
    <button class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#addFeeCanvas" aria-controls="addFeeCanvas">
        Add Fee
    </button>

    <!-- Offcanvas Component -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="addFeeCanvas" aria-labelledby="addFeeCanvasLabel">
        <div class="offcanvas-header">
            <h5 id="addFeeCanvasLabel" class="offcanvas-title border-bottom">Add Fee</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <!-- Your form elements go here -->
            <form id="feeForm">
                <div class="mb-3">
                    <label for="feeType" class="form-label">Fee Type</label>
                    <select id="feeType" class="form-select">
                        <option value="" disabled selected>Select Fee Type</option>
                        <!-- Options will be populated here -->
                    </select>
                </div>
                <div class="mb-3">
                    <label for="feeMonth" class="form-label">Fee Month</label>
                    <input type="text" id="feeMonth" class="form-control" placeholder="Enter Fee Month">
                </div>
                <div class="mb-3">
                    <label for="feeAmount" class="form-label">Fee Amount</label>
                    <input type="number" id="feeAmount" class="form-control" placeholder="Enter Fee Amount">
                </div>
                <button type="button" id="saveFeeButton" class="btn btn-primary">Save Fee</button>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const feeTypeDropdown = document.getElementById("feeType");
            const saveFeeButton = document.getElementById("saveFeeButton");
            const feeForm = document.getElementById("feeForm");
            const feeTableBody = document.querySelector("#FeeCollection tbody");
            const addFeeCanvasEl = document.getElementById("addFeeCanvas");
            let isSaveButtonClicked = false;

            if (!addFeeCanvasEl) {
                console.error('Element with ID "addFeeCanvas" not found');
                return;
            }

            const addFeeCanvas = bootstrap.Offcanvas.getInstance(addFeeCanvasEl) || new bootstrap.Offcanvas(addFeeCanvasEl);

            // Fetch fee heads and populate the dropdown
            const fetchFeeHeads = async (retryCount = 3, delayMs = 1000) => {
                feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
                try {
                    const response = await fetch("../php/feeCanva/fetch_canva_feeHead.php");
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                    const result = await response.json();
                    if (result.status !== 'success' || !Array.isArray(result.data)) {
                        throw new Error("Invalid response structure or no data.");
                    }

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
                }
            };

            // Initialize event listeners
            const initialize = () => {
                fetchFeeHeads();
                saveFeeButton.addEventListener("click", handleSaveFee);
            };

            initialize();
        });
    </script>
</body>
</html>*/
