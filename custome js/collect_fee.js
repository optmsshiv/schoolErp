document.addEventListener('DOMContentLoaded', function () {
  const collectFeeButton = document.getElementById('collect_fee_btn');
  const tableBody = document.querySelector('#student_data tbody');
 // const errorMessage = document.getElementById('error-message');

  if (collectFeeButton) {
    collectFeeButton.addEventListener('click', function (event) {
      if (!isTableDataAvailable(tableBody)) {
        event.preventDefault(); // Prevent navigation
        showError('No student data available!'); // Show error message
      } else {
        collectFeeData(); // Proceed with fee collection
      }
    });
  }
});

/**
 * Toggle the visibility of the loading bar.
 * @param {boolean} show - Whether to show or hide the loading bar.
 */
function toggleLoadingBar(show) {
  const loadingBar = document.getElementById('loading-bar'); // Loading bar element
  if (loadingBar) {
    loadingBar.style.display = show ? 'block' : 'none';
  }
}

/**
 * Check if the table contains any data rows.
 * @param {HTMLElement} tableBody - The table body element.
 * @returns {boolean} - True if data is available, false otherwise.
 */
function isTableDataAvailable(tableBody) {
  return tableBody && tableBody.querySelectorAll('tr').length > 0;
}

/**
 * Render student data into the table.
 * @param {HTMLElement} tableBody - The table body element.
 * @param {Array} data - Array of student objects.
 */
function renderStudentData(tableBody, data) {
  toggleLoadingBar(true); // Show loading bar while rendering

  setTimeout(() => {
    tableBody.innerHTML = ''; // Clear existing rows

    // Generate table rows for each student
    data.forEach(student => {
      const rows = `
        <tr>
          <td class="fw-bold">Student's Name:</td>
          <td>${student.full_name || 'N/A'}</td>
          <td class="fw-bold">Father's Name:</td>
          <td>${student.father_name || 'N/A'}</td>
          <td class="fw-bold">Monthly Fee:</td>
          <td>${student.monthly_fee || 'N/A'}</td>
        </tr>
        <tr>
          <td class="fw-bold">Class:</td>
          <td>${student.class_name || 'N/A'}</td>
          <td class="fw-bold">Mother's Name:</td>
          <td>${student.mother_name || 'N/A'}</td>
          <td class="fw-bold">Type:</td>
          <td>${student.day_hosteler || 'N/A'}</td>
        </tr>
        <tr>
          <td class="fw-bold">Roll Number:</td>
          <td>${student.roll_no || 'N/A'}</td>
          <td class="fw-bold">Mobile:</td>
          <td>${student.phone || 'N/A'}</td>
          <td class="fw-bold">Gender:</td>
          <td>${student.gender || 'N/A'}</td>
        </tr>
        <tr>
          <td class="fw-bold">Hostel Fee:</td>
          <td>${student.hostel_fee || 'N/A'}</td>
          <td class="fw-bold">Transport Fee:</td>
          <td>${student.transport_fee || 'N/A'}</td>
          <td class="fw-bold">User ID:</td>
          <td>${student.user_id || 'N/A'}</td>
        </tr>`;
      tableBody.insertAdjacentHTML('beforeend', rows);
    });

    toggleLoadingBar(false); // Hide loading bar after rendering
  }, 500); // Simulate rendering delay
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
    toggleLoadingBar(false); // Hide loading bar
    showError('No student data available to collect!');
    return;
  }

  // Group rows in sets of 4 to represent each student's data
  for (let i = 0; i < tableRows.length; i += 4) {
    const student = {
      full_name: getCellText(tableRows[i], 2),
      father_name: getCellText(tableRows[i], 4),
      monthly_fee: getCellText(tableRows[i], 6),
      class_name: getCellText(tableRows[i + 1], 2),
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
 * Show an error message.
 * @param {string} message - The error message to display.
 */
function showError(message) {
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => (errorMessage.style.display = 'none'), 3000); // Hide after 3 seconds
  }
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
