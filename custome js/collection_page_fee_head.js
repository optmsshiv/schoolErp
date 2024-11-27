document.addEventListener('DOMContentLoaded', function () {
  const studentData = JSON.parse(sessionStorage.getItem('studentData'));

  if (studentData && studentData.length > 0) {
    // Assume we're working with the first student for simplicity
    const { roll_no } = studentData[0];

    if (roll_no) {
      fetchStudentFeeData(roll_no); // Fetch fee details for the student
      populateStudentInfo(studentData[0]); // Populate student info
    } else {
      console.error('Roll number is missing in student data.');
    }
  } else {
    console.error('No student data found in session storage.');
  }
});

function fetchStudentFeeData(rollNo) {
  const apiUrl = `../php/collectFeeStudentDetails/student_fee_details.php?roll_no=${rollNo}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ status, data }) => {
      if (status !== 'success' || !Array.isArray(data) || data.length === 0) {
        console.error('No fee data available or an error occurred');
        showAlert('No fee data available for this student.', 'info');
        return;
      }

      populateFeeTable(data);
    })
    .catch(error => {
      console.error('Error fetching fee data:', error);
      showAlert('Unable to fetch fee data. Please try again later.', 'error');
    });
}

function populateFeeTable(data) {
  const months = [
    'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'
  ];

  // Create a map to organize data by Fee Head and months
  const feeDataMap = {};

  data.forEach(({ fee_head_name, month_name, amount }) => {
    if (!feeDataMap[fee_head_name]) {
      feeDataMap[fee_head_name] = new Array(months.length).fill(''); // Initialize months array
    }

    const monthIndex = months.indexOf(month_name); // Get month index
    if (monthIndex !== -1) {
      feeDataMap[fee_head_name][monthIndex] = amount; // Assign the amount to the correct month
    }
  });

  // Populate the table dynamically
  const tableBody = document.querySelector('#student_fee_table tbody');
  tableBody.innerHTML = ''; // Clear any existing rows

  Object.entries(feeDataMap).forEach(([feeHeadName, monthAmounts]) => {
    const row = document.createElement('tr');
    row.classList.add('text-center');

    // Fee Head column
    const feeHeadCell = document.createElement('td');
    feeHeadCell.textContent = feeHeadName;
    row.appendChild(feeHeadCell);

    // Amount columns for each month
    monthAmounts.forEach(amount => {
      const amountCell = document.createElement('td');
      amountCell.textContent = amount || ''; // Leave empty if no amount
      row.appendChild(amountCell);
    });

    // Append row to the table body
    tableBody.appendChild(row);
  });
}

function populateStudentInfo(student) {
  const feeTable = document.querySelector('#student_fee_data tbody');
  feeTable.innerHTML = ''; // Clear existing rows

  const row1 = `
    <tr>
      <td class="fw-bold">Student's Name:</td>
      <td>${student.full_name}</td>
      <td class="fw-bold">Father's Name:</td>
      <td>${student.father_name}</td>
      <td class="fw-bold">Monthly Fee:</td>
      <td>${student.monthly_fee}</td>
    </tr>`;

  const row2 = `
    <tr>
      <td class="fw-bold">Class:</td>
      <td>${student.class_name}</td>
      <td class="fw-bold">Mother's Name:</td>
      <td>${student.mother_name}</td>
      <td class="fw-bold">Type:</td>
      <td>${student.day_hosteler}</td>
    </tr>`;

  feeTable.insertAdjacentHTML('beforeend', row1 + row2);
}

// Optional helper function to display alerts
function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
  });
}
