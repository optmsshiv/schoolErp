document.addEventListener('DOMContentLoaded', function () {

   // Initially, ensure the loading bar is hidden by default
  toggleLoadingBar(false);  // This will hide the loading bar on a page load

  // Load banks when page loads
  loadBankNames();

  const collectFeeButton = document.getElementById('collect_fee_btn');
  const tableBody = document.querySelector('#student_data tbody');

  if (collectFeeButton) {
    collectFeeButton.addEventListener('click', function (event) {
      if (!isTableDataAvailable(tableBody)) {
        event.preventDefault(); // Prevent navigation
        showErrorWithLoadingBar('No student data available!'); // Show error with loading bar
      } else {
        collectFeeData(); // Proceed with fee collection
      }
    });
  }
});

/**
 * Check if the table contains any data rows.
 * @param {HTMLElement} tableBody - The table body element.
 * @returns {boolean} - True if data is available, false otherwise.
 */
function isTableDataAvailable(tableBody) {
  return tableBody && tableBody.querySelectorAll('tr').length > 0;
}

/**
 * Show an error message alongside the loading bar.
 * @param {string} message - The error message to display.
 */
function showErrorWithLoadingBar(message) {
  toggleLoadingBar(true); // Show loading bar
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('invisible'); // Show an error message
  }

  // Hide both loading bar and error message after a delay
  setTimeout(() => {
    toggleLoadingBar(false);
    if (errorMessage) {
      errorMessage.classList.add('invisible'); // Hide error message
    }
  }, 3000); // 3-second delay
}

/**
 * Toggle the visibility of the loading bar.
 * @param {boolean} show - Whether to show or hide the loading bar.
 */
function toggleLoadingBar(show) {
  const loadingBar = document.getElementById('loading-bar');
  if (loadingBar) {
    loadingBar.classList.toggle('invisible', !show); // Toggle loading bar visibility
  }
}

/**
 * Collect student fee data from the table and save it in session storage.
 */
function collectFeeData() {
  toggleLoadingBar(true); // Show loading bar while collecting data

  const tableRows = document.querySelectorAll('#student_data tbody tr');
  const studentData = [];

  // Validate if the table contains any data
  if (tableRows.length === 0) {
    showErrorWithLoadingBar('No student data available to collect!');
    return;
  }

  // Group rows in sets of 4 to represent each student's data
  for (let i = 0; i < tableRows.length; i += 4) {
    const student = {
      full_name: getCellText(tableRows[i], 2),
      father_name: getCellText(tableRows[i], 4),
      monthly_fee: getCellText(tableRows[i], 6),
      class_id: tableRows[i + 1].dataset.classId || getCellText(tableRows[i + 1], 2),
      class_name: getCellText(tableRows[i + 1], 2),   // store class name
      mother_name: getCellText(tableRows[i + 1], 4),
      day_hosteler: getCellText(tableRows[i + 1], 6),
      roll_no: getCellText(tableRows[i + 2], 2),
      phone: getCellText(tableRows[i + 2], 4),
      gender: getCellText(tableRows[i + 2], 6),
      hostel_fee: getCellText(tableRows[i + 3], 2),
      transport_fee: getCellText(tableRows[i + 3], 4),
      user_id: getCellText(tableRows[i + 3], 6),
    };
    studentData.push(student);
  }

  // Store data in session storage
  sessionStorage.setItem('studentData', JSON.stringify(studentData));
  toggleLoadingBar(false); // Hide loading bar after data is collected
}

/**
 * Helper function to get text content from a specific cell in a table row.
 * @param {HTMLElement} row - The table row element.
 * @param {number} cellIndex - The index of the cell.
 * @returns {string} - The trimmed text content of the cell.
 */
function getCellText(row, cellIndex) {
  const cell = row.querySelector(`td:nth-child(${cellIndex})`);
  return cell ? cell.textContent.trim() : 'N/A';
}

function loadBankNames() {
  fetch("../php/submitFee/get_banks.php")
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const bankDropdown = document.getElementById("bankName");

        bankDropdown.innerHTML = `<option value="">Select Bank</option>`;

        data.banks.forEach(bank => {
          const option = document.createElement("option");
          option.value = bank.BankName;
          option.textContent = bank.BankName;
          bankDropdown.appendChild(option);
        });
      } else {
        console.error("Failed to load banks:", data.error);
      }
    })
    .catch(error => console.error("Fetch failed:", error));
}

