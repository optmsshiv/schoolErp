document.addEventListener('DOMContentLoaded', function () {
  // Load fee plans and student details when the page loads
  fetchFeePlansData();
  loadStudentData();
});

function fetchFeePlansData() {
  const apiUrl = '../php/collectFeeStudentDetails/collection_page_fee_head.php'; // Update path as needed

 

  // Prepare data to send to the backend
  const formData = new FormData();
  formData.append('class_name', className);

  fetch(apiUrl, {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ status, data, message }) => {
      if (status !== 'success' || !Array.isArray(data) || data.length === 0) {
        console.error(message || 'No data available or an error occurred');
        showAlert(message || 'No data available to display.', 'error');
        return;
      }

      const months = [
        'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December', 'January', 'February', 'March'
      ];

      // Populate the table header dynamically
      const theadRow = document.querySelector('#student_fee_table thead tr');
      theadRow.innerHTML = '<th>Fee Head</th>'; // Add "Fee Head" column

      months.forEach(month => {
        const th = document.createElement('th');
        th.textContent = month;
        theadRow.appendChild(th);
      });

      // Create a map to organize data by Fee Head and months
      const feeDataMap = {};
      let totalAmounts = new Array(months.length).fill(0);

      data.forEach(({ fee_head_name, month_name, amount }) => {
        if (!feeDataMap[fee_head_name]) {
          feeDataMap[fee_head_name] = new Array(months.length).fill('');
        }

        const monthIndex = months.indexOf(month_name);
        if (monthIndex !== -1) {
          feeDataMap[fee_head_name][monthIndex] = amount;
          totalAmounts[monthIndex] += parseFloat(amount || 0);
        }
      });

      // Populate the table body dynamically
      const tableBody = document.querySelector('#student_fee_table tbody');
      tableBody.innerHTML = '';

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
          amountCell.textContent = amount || '';
          row.appendChild(amountCell);
        });

        tableBody.appendChild(row);
      });

      // Add "Total" row with amount buttons
      const totalRow = document.createElement('tr');
      totalRow.classList.add('text-center');

      const totalFeeHeadCell = document.createElement('td');
      totalFeeHeadCell.textContent = 'Total';
      totalRow.appendChild(totalFeeHeadCell);

      totalAmounts.forEach(totalAmount => {
        const totalAmountCell = document.createElement('td');
        totalAmountCell.innerHTML = `
          <div class="amount-button">
            <div class="amount">${totalAmount || ''}</div>
            <button class="btn btn-outline-success rounded-circle">
              <i class="bx bx-plus"></i>
            </button>
          </div>`;
        totalRow.appendChild(totalAmountCell);
      });

      tableBody.appendChild(totalRow);
    })
    .catch(error => {
      console.error('Error fetching fee plans data:', error);
      showAlert('Unable to fetch data. Please try again later.', 'error');
    });
}

function loadStudentData() {
  const studentData = JSON.parse(sessionStorage.getItem('studentData'));
  if (!studentData || studentData.length === 0) {
    console.error('No student data found in session storage.');
    return;
  }

  const feeTable = document.querySelector('#student_fee_data tbody');
  feeTable.innerHTML = '';

  studentData.forEach(student => {
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

    const row3 = `
      <tr>
        <td class="fw-bold">Roll number:</td>
        <td>${student.roll_no}</td>
        <td class="fw-bold">Mobile:</td>
        <td>${student.phone}</td>
        <td class="fw-bold">Gender:</td>
        <td>${student.gender}</td>
      </tr>`;

    const row4 = `
      <tr>
          <td class="fw-bold">Hotel Fee:</td>
          <td>${student.hotel_fee}</td>
          <td class="fw-bold">Transport Fee:</td>
          <td>${student.transport_fee}</td>
      </tr>`;

    feeTable.insertAdjacentHTML('beforeend', row1 + row2 + row3 + row4);
  });
}

// Optional helper function to display alerts
function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
  });
}
