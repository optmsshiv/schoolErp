document.addEventListener('DOMContentLoaded', function () {
  // Show a loading spinner
  document.getElementById('canvas-container').innerHTML =
    '<div class="text-center my-4">' +
    '<div class="spinner-border" role="status">' +
    '<span class="visually-hidden">Loading...</span>' +
    '</div>' +
    '</div>';

  // Fetch and load the offcanvas HTML
  fetch('/html/add_fee_canvas.html')
    .then(response => {
      if (!response.ok) throw new Error('HTML Load Failed');
      return response.text();
    })
    .then(html => {
      document.getElementById('canvas-container').innerHTML = html;
      initializeFeeCanvas(); // Ensure the canvas is initialized after loading
    })
    .catch(error => {
      console.error('Error loading canvas:', error);
      Swal.fire('Error', 'Failed to load the fee canvas. Please try again.', 'error');
    });

  function initializeFeeCanvas() {
    const feeTypeDropdown = document.getElementById('feeType');
    const saveFeeButton = document.getElementById('saveFeeButton');
    const feeForm = document.getElementById('feeForm');
    const feeTableBody = document.querySelector('#FeeCollection tbody');
    const addFeeCanvasEl = document.getElementById('addFeeCanvas');
    const payableAmountInput = document.getElementById('payableAmount');
    let isSaveButtonClicked = false;
    let totalAmount = 0;

    if (!addFeeCanvasEl) {
      console.error('Element with ID "addFeeCanvas" not found');
      return;
    }

    const addFeeCanvas = new bootstrap.Offcanvas(addFeeCanvasEl);

    // Fetch fee heads and populate the dropdown
    async function fetchFeeHeads(retryCount = 3, delayMs = 1000) {
      feeTypeDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
      try {
        const response = await fetch('../php/feeCanva/fetch_canva_feeHead.php');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        if (result.status !== 'success' || !Array.isArray(result.data)) {
          throw new Error('Invalid response structure or no data.');
        }

        feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>';
        result.data.forEach(({ fee_head_id, fee_head_name }) => {
          if (fee_head_id && fee_head_name) {
            const option = document.createElement('option');
            option.value = fee_head_id;
            option.textContent = fee_head_name;
            feeTypeDropdown.appendChild(option);
          }
        });
      } catch (error) {
        console.error('Error fetching fee types:', error);
        feeTypeDropdown.innerHTML = '<option value="" disabled selected>Error loading fee types</option>';

        if (retryCount > 0) {
          console.warn(`Retrying... Attempts left: ${retryCount}`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          await fetchFeeHeads(retryCount - 1, delayMs);
        } else {
          Swal.fire('Error', 'Failed to load fee types after multiple attempts.', 'error');
        }
      }
    }

    // Utility function to capitalize first letter of each word
    const capitalize = str => str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

    // Validate form fields
    function validateForm() {
      const feeMonthElement = document.getElementById('feeMonth');
      const feeAmountElement = document.getElementById('feeAmount');

      if (!feeMonthElement || !feeAmountElement) {
        console.error('Required form elements are missing!');
        return { isValid: false, message: 'Form validation failed.' };
      }

      const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex]?.text || '';
      const feeAmount = feeAmountElement.value.trim();
      const feeMonth = capitalize(feeMonthElement.value.trim());

      if (!feeType || feeTypeDropdown.value === '') return { isValid: false, message: 'Please select a fee type.' };
      if (!feeAmount || isNaN(feeAmount) || Number(feeAmount) <= 0)
        return { isValid: false, message: 'Please enter a valid fee amount.' };
      if (!feeMonth) return { isValid: false, message: 'Please select a valid month.' };

      return { isValid: true, feeType, feeAmount, feeMonth };
    }

    // Handle Save Fee button click
    function handleSaveFee() {
      isSaveButtonClicked = true;

      const { isValid, message, ...data } = validateForm();
      if (isValid) {
        addRowToTable(data);
        feeForm.reset();
        addFeeCanvas.hide();

        Swal.fire({
          title: 'Success',
          text: 'Fee details added successfully.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading()
        });
      } else {
        Swal.fire('Error', message, 'error');
      }

      isSaveButtonClicked = false;
    }

    // Add a new row to the table
    function addRowToTable({ feeMonth, feeType, feeAmount }) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
                <td>${feeMonth}</td>
                <td>${feeType}</td>
                <td class="totalAmountCell">${feeAmount}</td>
                <td>
                    <button class="btn editFeeButton"><i class="btn-outline-warning bx bx-edit bx-sm"></i></button>
                    <button class="btn deleteFeeButton"><i class="btn-outline-danger bx bx-trash bx-sm"></i></button>
                </td>
            `;

      feeTableBody.appendChild(newRow);
      updateTotalAmount(parseFloat(feeAmount));

      // Add Delete Button Event Listener
      newRow.querySelector('.deleteFeeButton').addEventListener('click', () => handleDeleteFee(newRow));

      // Add Edit Button Event Listener
      newRow.querySelector('.editFeeButton').addEventListener('click', () => handleEditFee(newRow));
    }

    // Update total amount
    function updateTotalAmount(amountChange) {
      totalAmount += amountChange;
      payableAmountInput.value = totalAmount.toFixed(2);
    }

    // Handle Delete Fee
    function handleDeleteFee(row) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.isConfirmed) {
          updateTotalAmount(-parseFloat(row.children[2].textContent));
          row.remove();
          Swal.fire('Deleted!', 'The fee record has been deleted.', 'success');
        }
      });
    }

    // Handle Offcanvas Hide Event
    addFeeCanvasEl.addEventListener('hide.bs.offcanvas', () => {
      if (!isSaveButtonClicked) feeForm.reset();
    });

    // Initialize event listeners
    function initialize() {
      fetchFeeHeads();
      saveFeeButton.addEventListener('click', handleSaveFee);
    }

    initialize();
  }
});
