document.addEventListener('DOMContentLoaded', function () {
  // Fetch and populate student data on page load
  fetchFeeData();

  // Handle "Collect Fee" button click
  document.getElementById('collect_fee_btn').addEventListener('click', collectFeeData);
});

/**
 * Fetch student and fee data from the server and populate the UI.
 */
async function fetchFeeData() {
  const loadingBar = document.getElementById('loading-bar'); // Loading bar element
  const tableBody = document.querySelector('#student_data tbody'); // Student data table body
  const feeTableBody = document.querySelector('#optms tbody'); // Fee data table body

  // Show loading bar if present
  if (loadingBar) loadingBar.style.display = 'block';

  try {
    // Fetch student and fee data from the server
    const response = await fetch('/php/collectFeeStudentDetails/students_fee_details.php');

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    const data = await response.json();

    // Validate the data
    if (!data || !data.student || !data.fee) {
      renderNoDataMessage(tableBody, feeTableBody);
      return;
    }

    // Render student data
    renderStudentData(tableBody, data.student);

    // Render fee data
    renderFeeData(data.fee);

  } catch (error) {
    console.error('Error fetching data:', error);

  } finally {
    // Hide loading bar
    if (loadingBar) loadingBar.style.display = 'none';
  }
}

/**
 * Render fee details into the cards and fee table.
 * @param {Object} feeData - Fee data object.
 */
function renderFeeData(feeData) {
  // Update fee cards
  document.getElementById('total_paid_amount').textContent = `₹ ${feeData.totalPaid || 0}`;
  document.getElementById('pending_amount').textContent = `₹ ${feeData.pendingAmount || 0}`;
  document.getElementById('hostel_amount').textContent = `₹ ${feeData.hostelAmount || 0}`;
  document.getElementById('transport_amount').textContent = `₹ ${feeData.transportAmount || 0}`;

  // Update fee table
  const feeTableBody = document.querySelector('#optms tbody');
  feeTableBody.innerHTML = ''; // Clear existing rows

  if (Array.isArray(feeData.details) && feeData.details.length > 0) {
    feeData.details.forEach(fee => {
      const row = `
        <tr>
          <td>${fee.receiptId || 'N/A'}</td>
          <td>${fee.month || 'N/A'}</td>
          <td align="center">${fee.dueAmount || '0'}</td>
          <td align="center">${fee.pendingAmount || '0'}</td>
          <td align="center">${fee.receivedAmount || '0'}</td>
          <td align="center">${fee.totalAmount || '0'}</td>
          <td>
            <span class="badge ${fee.status === 'Paid' ? 'bg-label-success' : 'bg-label-danger'}">
              ${fee.status || 'N/A'}
            </span>
          </td>
          <td align="center">
            <div class="dropdown">
              <button class="btn text-muted p-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bx bx-dots-vertical-rounded bx-sm"></i>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a class="dropdown-item border-bottom" href="#">View Fee Receipt</a></li>
                <li><a class="dropdown-item border-bottom" href="#">Send Fee Receipt</a></li>
                <li><a class="dropdown-item border-bottom" href="#">Send Fee Message</a></li>
                <li><a class="dropdown-item" href="#">Delete</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
      feeTableBody.insertAdjacentHTML('beforeend', row);
    });
  } else {
    feeTableBody.innerHTML = '<tr><td colspan="8">No fee data available</td></tr>';
  }
}

/**
 * Render a message when no data is available.
 * @param {HTMLElement} studentTableBody - The student table body element.
 * @param {HTMLElement} feeTableBody - The fee table body element.
 */
function renderNoDataMessage(studentTableBody, feeTableBody) {
  studentTableBody.innerHTML = '<tr><td colspan="6">No student data available</td></tr>';
  feeTableBody.innerHTML = '<tr><td colspan="8">No fee data available</td></tr>';
}

/**
 * Render student data into the table.
 * @param {HTMLElement} tableBody - The table body element.
 * @param {Array} data - Array of student objects.
 */
function renderStudentData(tableBody, data) {
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
}

/**
 * Collect student fee data from the table and save it in session storage.
 */
function collectFeeData() {
  const tableRows = document.querySelectorAll('#student_data tbody tr');
  const studentData = [];

  // Validate if the table contains any data
  if (tableRows.length === 0) {
    console.error('No student data available to collect.');
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

/**
 * Render a message when no data is available.
 * @param {HTMLElement} tableBody - The table body element.
 */
function renderNoDataMessage(tableBody) {
  tableBody.innerHTML = '<tr><td colspan="6">No student data available</td></tr>';
}

/**
 * Render an error message in the table body.
 * @param {HTMLElement} tableBody - The table body element.
 */
function renderErrorMessage(tableBody) {
  tableBody.innerHTML = '<tr><td colspan="6">Search Student by Name or Father Name to get Details.</td></tr>';
}
