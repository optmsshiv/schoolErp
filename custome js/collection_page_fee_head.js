document.addEventListener('DOMContentLoaded', function () {
  // Example: You can fetch the class_name dynamically from sessionStorage or another source
  const className = sessionStorage.getItem('selectedClassName') || '';

  fetchFeePlansData(className);
});

function fetchFeePlansData(className) {
  fetch(`../php/collectFeeStudentDetails/collection_page_fee_head.php?class_name=${encodeURIComponent(className)}`)
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const months = [
          'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'
        ];

        // Dynamically populate the table header
        const theadRow = document.querySelector('#student_fee_table thead tr');
        theadRow.innerHTML = '<th>Fee Head</th>'; // Add Fee Head column

        months.forEach(month => {
          const th = document.createElement('th');
          th.textContent = month;
          theadRow.appendChild(th);
        });

        // Create a map of fee heads and their corresponding months/amounts
        const feeDataMap = {};

        data.forEach(record => {
          const { fee_head_name, month_name, amount } = record;

          if (!feeDataMap[fee_head_name]) {
            feeDataMap[fee_head_name] = new Array(months.length).fill(''); // Initialize empty array for months
          }

          const monthIndex = months.indexOf(month_name); // Get month index
          if (monthIndex !== -1) {
            feeDataMap[fee_head_name][monthIndex] = amount; // Assign amount to the correct month
          }
        });

        // Populate the table body dynamically
        const tableBody = document.querySelector('#student_fee_table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        Object.keys(feeDataMap).forEach(feeHeadName => {
          const row = document.createElement('tr');
          row.classList.add('text-center');

          // Add Fee Head Column
          const feeHeadCell = document.createElement('td');
          feeHeadCell.textContent = feeHeadName;
          row.appendChild(feeHeadCell);

          // Add Amount Columns for Each Month
          feeDataMap[feeHeadName].forEach(amount => {
            const amountCell = document.createElement('td');
            amountCell.textContent = amount || ''; // Leave empty if no amount
            row.appendChild(amountCell);
          });

          // Append the row to the table body
          tableBody.appendChild(row);
        });
      } else {
        console.error('No data found for class:', className);
      }
    })
    .catch(error => console.error('Error fetching fee plans:', error));
}
