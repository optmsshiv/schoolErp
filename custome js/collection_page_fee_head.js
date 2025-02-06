document.addEventListener('DOMContentLoaded', function () {
  try {
    const studentData = JSON.parse(sessionStorage.getItem('studentData')); // Retrieve data from session storage

    if (studentData && Array.isArray(studentData) && studentData.length > 0) {
      fetchFeePlansData(studentData);
    } else {
      console.error('No valid student data found in session storage.');
      showAlert('Student data is missing or invalid.', 'error');
    }
  } catch (error) {
    console.error('Error parsing student data:', error);
    showAlert('Failed to load student data.', 'error');
  }

  const feeCollectionTable = document.querySelector('#FeeCollection tbody');
  const studentFeeTable = document.querySelector('#student_fee_table');
  const payableAmountField = document.getElementById('payableAmount');
  const concessionFeeField = document.getElementById('concessionFee');
  const receivedFeeField = document.getElementById('recievedFee');

  studentFeeTable.addEventListener('click', handleFeeTableClick);
  feeCollectionTable.addEventListener('click', handleFeeCollectionClick);

  concessionFeeField.addEventListener('input', updatePayableAmount);
  receivedFeeField.addEventListener('input', calculateDueAndAdvanced);

  const observer = new MutationObserver(() => {
    updateTotalAmount();
  });

  observer.observe(feeCollectionTable, { childList: true, subtree: true });

  function handleFeeTableClick(event) {
    const button = event.target.closest('.btn-outline-primary');
    if (button) {
      const cell = button.closest('td');
      const row = cell.closest('tr');
      const monthIndex = Array.from(row.children).indexOf(cell);
      const feeHead = row.children[0].textContent;
      const amount = parseFloat(cell.querySelector('.amount').textContent);
      const month = document.querySelector(`#student_fee_table thead tr th:nth-child(${monthIndex + 1})`).textContent;

      if (feeHead === 'Total') {
        addToFeeCollection(month, 'Monthly Fee', amount);
        button.style.display = 'none';
      }
    }
  }

  function handleFeeCollectionClick(event) {
    const deleteButton = event.target.closest('.deleteFeeButton');
    if (deleteButton) {
      const row = deleteButton.closest('tr');
      const amount = parseFloat(row.children[2].textContent);

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          totalAmount -= amount;
          document.querySelector('#payableAmount').value = totalAmount.toFixed(2);
          row.remove();
          updatePlusButtonVisibility(row);
          updateTotalAmount();
        } else {
          Swal.fire('Cancelled', 'The fee record is safe!', 'info');
        }
      });
    }
  }

  function fetchFeePlansData(studentData) {
    const months = [
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
      'January',
      'February',
      'March'
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
      row.innerHTML = `<td>${feeHeadName}</td>`;
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
    totalRow.innerHTML = '<td>Total</td>';

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

  function addToFeeCollection(month, feeType, amount) {
    const tableBody = document.querySelector('#FeeCollection tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${month}</td>
      <td>${feeType}</td>
      <td>${amount}</td>
      <td class="text-center">
        <button class="btn text-muted h-px-30 deleteFeeButton" type="button">
          <i class="btn-outline-danger bx bx-trash bx-sm"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(newRow);
    totalAmount += parseFloat(amount);
    updateTotalAmount();
  }

  function updateTotalAmount() {
    totalAmount = Array.from(document.querySelectorAll('#FeeCollection tbody tr')).reduce(
      (sum, row) => sum + parseFloat(row.querySelector('td:nth-child(3)').textContent) || 0,
      0
    );

    payableAmountField.value = totalAmount.toFixed(2);
  }

  function updatePlusButtonVisibility(row) {
    const month = row.children[0].textContent;
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

  function updatePayableAmount() {
    const concessionFee = parseFloat(concessionFeeField.value) || 0;
    const updatedPayableAmount = Math.max(totalAmount - concessionFee, 0);
    payableAmountField.value = updatedPayableAmount.toFixed(2);
  }

  function calculateDueAndAdvanced() {
    const payableAmount = parseFloat(payableAmountField.value) || 0;
    const receivedFee = parseFloat(receivedFeeField.value) || 0;

    if (receivedFee < payableAmount) {
      document.getElementById('dueAmount').value = (payableAmount - receivedFee).toFixed(2);
      document.getElementById('advancedFee').value = 0;
    } else {
      document.getElementById('dueAmount').value = 0;
      document.getElementById('advancedFee').value = (receivedFee - payableAmount).toFixed(2);
    }
  }

  function showAlert(message, type) {
    Swal.fire({
      icon: type,
      title: type === 'error' ? 'Error' : 'Info',
      text: message,
      confirmButtonText: 'OK'
    });
  }
});
