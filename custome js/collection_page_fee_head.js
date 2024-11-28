document.addEventListener('DOMContentLoaded', function () {
  fetchClassNames().then(classNames => {
    classNames.forEach(className => {
      fetchFeePlansData(className);
    });
  });
});

function fetchClassNames() {
  const apiUrl = '../php/collectFeeStudentDetails/get_class_names.php'; // Endpoint to fetch class names

  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ status, data }) => {
      if (status === 'success' && Array.isArray(data) && data.length > 0) {
        return data; // Return the list of class names
      } else {
        console.error('No class names available or an error occurred');
        return [];
      }
    })
    .catch(error => {
      console.error('Error fetching class names:', error);
      return [];
    });
}

function fetchFeePlansData(className) {
  const apiUrl = `../php/collectFeeStudentDetails/collection_page_fee_head.php?class_name=${encodeURIComponent(className)}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ status, data, message }) => {
      if (status !== 'success' || !Array.isArray(data) || data.length === 0) {
        showAlert(
          `Fee generation not found for the class: ${className}. First generate the fee for this class.`,
          'error'
        );
        return;
      }

      // Populate the fee table if data exists
      populateFeeTable(data, className);
    })
    .catch(error => {
      console.error('Error fetching fee plans data:', error);
      showAlert('Unable to fetch data. Please try again later.', 'error');
    });
}

function populateFeeTable(data, className) {
  const months = [
    'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'
  ];

  // Generate the table header dynamically
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

  let totalAmounts = new Array(months.length).fill(0);

  Object.entries(feeDataMap).forEach(([feeHeadName, monthAmounts]) => {
    const row = document.createElement('tr');
    row.classList.add('text-center');

    const feeHeadCell = document.createElement('td');
    feeHeadCell.textContent = feeHeadName;
    row.appendChild(feeHeadCell);

    monthAmounts.forEach((amount, index) => {
      const amountCell = document.createElement('td');
      amountCell.textContent = amount || '';
      row.appendChild(amountCell);

      if (amount && !isNaN(amount)) {
        totalAmounts[index] += parseFloat(amount);
      }
    });

    tableBody.appendChild(row);
  });

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
        <button class="btn btn-outline-primary rounded-circle">
          <i class="bx bx-plus"></i>
        </button>
      </div>
    `;
    totalRow.appendChild(totalAmountCell);
  });

  tableBody.appendChild(totalRow);
}

function showAlert(message, type) {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Error' : 'Info',
    text: message,
  });
}
