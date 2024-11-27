document.addEventListener('DOMContentLoaded', function () {
  const className = sessionStorage.getItem('className'); // Assuming you save className in session storage

  if (!className) {
    showAlert('Class name is missing. Cannot fetch data.', 'error');
    return;
  }

  fetchFeePlansData(className);
});

function fetchFeePlansData(className) {
  const apiUrl = `../php/collectFeeStudentDetails/collection_page_fee_head.php?class_name=${encodeURIComponent(className)}`; // Pass class_name as query param

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ status, data }) => {
      if (status !== 'success' || !Array.isArray(data) || data.length === 0) {
        console.error('No data available or an error occurred');
        showAlert('No data available to display.', 'error');
        return;
      }

      const months = [
        'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'
      ];

      const theadRow = document.querySelector('#student_fee_table thead tr');
      theadRow.innerHTML = '<th>Fee Head</th>'; // Add "Fee Head" column

      months.forEach(month => {
        const th = document.createElement('th');
        th.textContent = month;
        theadRow.appendChild(th);
      });

      const feeDataMap = {};

      data.forEach(({ fee_head_name, month_name, amount }) => {
        if (!feeDataMap[fee_head_name]) {
          feeDataMap[fee_head_name] = new Array(months.length).fill('');
        }

        const monthIndex = months.indexOf(month_name);
        if (monthIndex !== -1) {
          feeDataMap[fee_head_name][monthIndex] = amount;
        }
      });

      const tableBody = document.querySelector('#student_fee_table tbody');
      tableBody.innerHTML = '';

      Object.entries(feeDataMap).forEach(([feeHeadName, monthAmounts]) => {
        const row = document.createElement('tr');
        row.classList.add('text-center');

        const feeHeadCell = document.createElement('td');
        feeHeadCell.textContent = feeHeadName;
        row.appendChild(feeHeadCell);

        monthAmounts.forEach(amount => {
          const amountCell = document.createElement('td');
          amountCell.textContent = amount || '';
          row.appendChild(amountCell);
        });

        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching fee plans data:', error);
      showAlert('Unable to fetch data. Please try again later.', 'error');
    });
}

function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
  });
}
