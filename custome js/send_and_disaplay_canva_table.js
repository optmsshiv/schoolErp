document.addEventListener('DOMContentLoaded', function () {
  const feeTypeDropdown = document.getElementById("feeType");
  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeForm = document.getElementById("feeForm");
  const feeTableBody = document.querySelector("#FeeCollection tbody");
  const payableAmountInput = document.getElementById("payableAmount");
  let totalAmount = 0; // Initialize totalAmount

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
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>';
      result.data.forEach(({ fee_head_id, fee_head_name }) => {
        const option = document.createElement("option");
        option.value = fee_head_id;
        option.textContent = fee_head_name;
        feeTypeDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching fee types:", error);
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Error loading fee types</option>';

      if (retryCount > 0) {
        console.warn(`Retrying... Attempts left: ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        await fetchFeeHeads(retryCount - 1, delayMs);
      } else {
        Swal.fire("Error", "Failed to load fee types after multiple attempts.", "error");
      }
    }
  };

  // Utility function to capitalize the first letter of each word
  const capitalize = (str) => str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  // Update totalAmount and payableAmount input
  const updateAmount = (amountChange) => {
    totalAmount += amountChange;
    payableAmountInput.value = totalAmount.toFixed(2); // Update the payable amount input field
  };

  // Add a new row to the FeeCollection table
  const addRowToTable = ({ feeMonth, feeType, feeAmount }) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${feeMonth}</td>
      <td>${feeType}</td>
      <td>${feeAmount}</td>
      <td class="text-center">
        <button class="btn text-muted h-px-30" type="button" id="deleteButton">
          <i class="btn-outline-danger bx bx-trash bx-sm"></i>
        </button>
      </td>
    `;
    feeTableBody.appendChild(newRow);

    // Update the total amount by adding the fee amount
    updateAmount(parseFloat(feeAmount));

    // Add event listener for delete button
    newRow.querySelector('#deleteButton').addEventListener('click', () => {
      const amount = parseFloat(newRow.children[2].textContent);
      updateAmount(-amount); // Subtract from total when row is deleted
      newRow.remove(); // Remove the row from the table
    });
  };

  // Handle Save Fee button click
  const handleSaveFee = () => {
    const feeMonthElement = document.getElementById("feeMonth");
    const feeAmountElement = document.getElementById("feeAmount");

    const feeMonth = capitalize(feeMonthElement.value.trim());
    const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text || '';
    const feeAmount = feeAmountElement.value.trim();

    if (!feeMonth || !feeType || !feeAmount || isNaN(feeAmount) || Number(feeAmount) <= 0) {
      Swal.fire("Error", "Please fill in all fields correctly.", "error");
      return;
    }

    addRowToTable({ feeMonth, feeType, feeAmount });

    feeForm.reset();
    Swal.fire({
      title: "Success",
      text: "Fee details added successfully.",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => Swal.showLoading(),
    });
  };

  // Handle Offcanvas Hide Event (reset form if not saved)
  document.getElementById("addFeeCanvas").addEventListener("hide.bs.offcanvas", () => {
    feeForm.reset();
  });

  // Initialize event listeners
  const initialize = () => {
    fetchFeeHeads();
    saveFeeButton.addEventListener("click", handleSaveFee);
  };

  initialize();
});

(() => {
  // Consolidate logic for adding fee collection rows and updating amounts globally
  let totalAmount = 0;

  // Function to update total amount in payableAmount field
  const updatePayableAmount = () => {
    document.querySelector('#payableAmount').value = totalAmount.toFixed(2); // Display the total with 2 decimal places
  };

  // Function to update the totalAmount
  const updateTotalAmount = (amountChange) => {
    totalAmount += amountChange; // Add or subtract the amount
    updatePayableAmount(); // Reflect changes in the input field
  };

  // Generalized function for adding a row to the Fee Collection table
  function addToFeeCollection(month, feeType, amount) {
    const tableBody = document.querySelector('#FeeCollection tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${month}</td>
      <td>${feeType}</td>
      <td>${amount}</td>
      <td class="text-center">
        <button class="btn text-muted h-px-30" type="button" id="deleteButton">
          <i class="btn-outline-danger bx bx-trash bx-sm"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(newRow);

    // Update the total amount by adding the fee amount
    updateTotalAmount(parseFloat(amount));

    // Add event listener for delete button
    newRow.querySelector('#deleteButton').addEventListener('click', () => {
      const amount = parseFloat(newRow.children[2].textContent); // Get amount from the row
      updateTotalAmount(-amount); // Subtract from total when row is deleted
      newRow.remove(); // Remove the row from the table
    });
  }

  // Expose the functions globally for testing or calling outside this scope
  window.addToFeeCollection = addToFeeCollection;
})();
