document.addEventListener('DOMContentLoaded', function () {
  fetchFeePlansData();
});

function fetchFeePlansData() {
  const apiUrl = '../php/collectFeeStudentDetails/collection_page_fee_head.php'; // Update the path if required

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ status, data }) => {
      if (!Array.isArray(data) || data.length === 0) {
        console.error('No data available to display');
        showAlert('No data available to display.', 'error');
        return;
      }

      const months = [
        'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December', 'January', 'February', 'March'
      ];

      // Dynamically generate table header
      const theadRow = document.querySelector('#student_fee_table thead tr');
      theadRow.innerHTML = '<th>Fee Head</th>'; // Add "Fee Head" column

      months.forEach(month => {
        const th = document.createElement('th');
        th.textContent = month;
        theadRow.appendChild(th);
      });

      // Group data by class_name and fee_head_name
      const classFeeDataMap = {};

      data.forEach(({ class_name, fee_head_name, month_name, amount }) => {
        if (!classFeeDataMap[class_name]) {
          classFeeDataMap[class_name] = {}; // Initialize class object
        }

        if (!classFeeDataMap[class_name][fee_head_name]) {
          classFeeDataMap[class_name][fee_head_name] = new Array(months.length).fill(''); // Initialize months array
        }

        const monthIndex = months.indexOf(month_name);
        if (monthIndex !== -1) {
          classFeeDataMap[class_name][fee_head_name][monthIndex] = amount; // Assign amount to the correct month
        }
      });

      // Populate the table body dynamically
      const tableBody = document.querySelector('#student_fee_table tbody');
      tableBody.innerHTML = ''; // Clear any existing rows

      Object.entries(classFeeDataMap).forEach(([className, feeHeads]) => {
        // Add a header row for each class
        const classHeaderRow = document.createElement('tr');
        classHeaderRow.classList.add('class-header');
        classHeaderRow.innerHTML = `<td colspan="${months.length + 1}"><strong>Class: ${className}</strong></td>`;
        tableBody.appendChild(classHeaderRow);

        // Add rows for each fee head within the class
        Object.entries(feeHeads).forEach(([feeHeadName, monthAmounts]) => {
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

          // Append the row to the table body
          tableBody.appendChild(row);
        });
      });
    })
    .catch(error => {
      console.error('Error fetching fee plans data:', error);
      showAlert('Unable to fetch data. Please try again later.', 'error');
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
