document.addEventListener('DOMContentLoaded', function () {
  // Fetch and populate student data on page load
  fetchStudentData();

  // Handle "Collect Fee" button click
  document.getElementById('collect_fee_btn').addEventListener('click', collectFeeData);
});

/**
 * Fetch student data from the server and populate the table.
 */
async function fetchStudentData() {
  const loadingBar = document.getElementById('loading-bar'); // Loading bar element
  const tableBody = document.querySelector('#student_data tbody'); // Table body

  // Show loading bar if present
  if (loadingBar) loadingBar.style.display = 'block';

  try {
    // Fetch student data from the server
    const response = await fetch('../php/collectFeeStudentDetails/students_fee_details.php');
    const data = await response.json();

    // Clear table and populate rows
    renderStudentData(tableBody, data);
  } catch (error) {
    console.error('Error fetching student data:', error);
  } finally {
    // Hide loading bar
    if (loadingBar) loadingBar.style.display = 'none';
  }
}

/**
 * Render student data into the table.
 * @param {HTMLElement} tableBody - The table body element.
 * @param {Array} data - Array of student objects.
 */
function renderStudentData(tableBody, data) {
  tableBody.innerHTML = ''; // Clear existing rows

  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">No student data available</td></tr>';
    return;
  }

  // Generate table rows for each student
  data.forEach(student => {
    const rows = `
      <tr>
        <td class="fw-bold">Student's Name:</td>
        <td>${student.full_name}</td>
        <td class="fw-bold">Father's Name:</td>
        <td>${student.father_name}</td>
        <td class="fw-bold">Monthly Fee:</td>
        <td>${student.monthly_fee}</td>
      </tr>
      <tr>
        <td class="fw-bold">Class:</td>
        <td>${student.class_name}</td>
        <td class="fw-bold">Mother's Name:</td>
        <td>${student.mother_name}</td>
        <td class="fw-bold">Type:</td>
        <td>${student.day_hosteler}</td>
      </tr>
      <tr>
        <td class="fw-bold">Roll Number:</td>
        <td>${student.roll_no}</td>
        <td class="fw-bold">Mobile:</td>
        <td>${student.phone}</td>
        <td class="fw-bold">Gender:</td>
        <td>${student.gender}</td>
      </tr>
      <tr>
        <td class="fw-bold">Hotel Fee:</td>
        <td>${student.hotel_fee}</td>
        <td class="fw-bold">Transport Fee:</td>
        <td>${student.transport_fee}</td>
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
      hotel_fee: getCellText(tableRows[i + 3], 2),
      transport_fee: getCellText(tableRows[i + 3], 4),
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
  return row.querySelector(`td:nth-child(${cellIndex})`).textContent.trim();
}
