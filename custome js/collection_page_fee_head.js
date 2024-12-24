document.addEventListener('DOMContentLoaded', function () {
  let totalAmount = 0;

  // Helper function to display alerts
  function showAlert(message, type) {
    Swal.fire({
      icon: type,
      title: type === 'error' ? 'Error' : 'Info',
      text: message,
      confirmButtonText: 'OK',
    });
  }

  // Function to update the payable amount input field
  function updatePayableAmount() {
    document.querySelector('#payableAmount').value = totalAmount.toFixed(2);
  }

  // Function to update totalAmount
  function updateTotalAmount(amountChange) {
    totalAmount += amountChange;
    updatePayableAmount();
  }

  // Fetch fee plans data
  function fetchFeePlansData(studentData) {
    const months = [
      'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December',
      'January', 'February', 'March'
    ];

    const theadRow = document.querySelector('#student_fee_table thead tr');
    theadRow.innerHTML = '<th>Fee Head</th>';
    months.forEach(month => {
      const th = document.createElement('th');
      th.textContent = month;
      theadRow.appendChild(th);
    });

    const feeDataMap = {};

    studentData.forEach(student => {
      const { monthly_fee } = student;

      if (!feeDataMap['Monthly Fee']) {
        feeDataMap['Monthly Fee'] = new Array(months.length).fill(monthly_fee || 'N/A');
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
        amountCell.textContent = amount !== 'N/A' && amount ? amount : 'N/A';
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
          <div class="amount">${totalAmount > 0 ? totalAmount.toFixed(0) : 'N/A'}</div>
          <button class="btn btn-outline-primary rounded-circle">
            <i class="bx bx-plus"></i>
          </button>
        </div>
      `;
      totalRow.appendChild(totalAmountCell);
    });

    tableBody.appendChild(totalRow);
  }

  // Add data to the Fee Collection table
  function addToFeeCollection(month, feeType, amount) {
    const tableBody = document.querySelector('#FeeCollection tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${month}</td>
      <td>${feeType}</td>
      <td>${amount}</td>
      <td class="text-center">
        <button class="btn text-muted h-px-30" type="button" id="deleteButton">
          <i class="btn-outline-danger bx bx-trash bx-sm"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(newRow);
    updateTotalAmount(parseFloat(amount));

    newRow.querySelector('#deleteButton').addEventListener('click', () => {
      const amount = parseFloat(newRow.children[2].textContent);
      updateTotalAmount(-amount);
      newRow.remove();
    });
  }

  // Event listener for the "plus" buttons in the "Total" row
  document.querySelector('#student_fee_table').addEventListener('click', function (event) {
    if (event.target.closest('.btn-outline-primary')) {
      const button = event.target.closest('.btn-outline-primary');
      const cell = button.closest('td');
      const row = cell.closest('tr');
      const monthIndex = Array.from(row.children).indexOf(cell);
      const feeHead = row.children[0].textContent;
      const amount = cell.querySelector('.amount').textContent;

      const month = document.querySelector(`#student_fee_table thead tr th:nth-child(${monthIndex + 1})`).textContent;

      if (feeHead === 'Total') {
        const monthlyFeeType = 'Monthly Fee';
        addToFeeCollection(month, monthlyFeeType, amount);
        button.style.display = 'none';
      }
    }
  });

  // Event listener for delete buttons in the Fee Collection table
  document.querySelector('#FeeCollection tbody').addEventListener('click', function (event) {
    if (event.target.closest('#deleteButton')) {
      const row = event.target.closest('tr');
      const amount = parseFloat(row.children[2].textContent);

      if (!isNaN(amount)) {
        updateTotalAmount(-amount);
        document.querySelector('#payableAmount').value = totalAmount.toFixed(2);
      }

      const month = row.children[0].textContent;
      row.remove();

      const monthIndex = Array.from(document.querySelectorAll('#student_fee_table thead th')).findIndex(
        th => th.textContent === month
      );

      if (monthIndex > 0) {
        const totalRow = document.querySelector('#student_fee_table tbody tr:last-child');
        const totalCell = totalRow.children[monthIndex];
        const plusButton = totalCell.querySelector('.btn-outline-primary');
        if (plusButton) {
          plusButton.style.display = 'inline-block';
        }
      }
    }
  });

  // Initialize student data and fetch fee plans
  try {
    const studentData = JSON.parse(sessionStorage.getItem('studentData'));
    if (studentData && Array.isArray(studentData) && studentData.length > 0) {
      fetchFeePlansData(studentData);
    } else {
      showAlert('Student data is missing or invalid.', 'error');
    }
  } catch (error) {
    showAlert('Failed to load student data.', 'error');
  }
});
