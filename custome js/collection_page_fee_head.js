document.addEventListener('DOMContentLoaded', function () {
  fetchFeePlansData();
});

function fetchFeePlansData() {
  fetch('../php/collectFeeStudentDetails/collection_page_fee_head.php') // Replace with the actual PHP script path
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const months = [
          'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'
        ];

        // Create a map of fee heads and their corresponding months/amounts
        const feeDataMap = {};

        data.forEach(record => {
          const { fee_head, month, amount } = record;

          if (!feeDataMap[fee_head]) {
            feeDataMap[fee_head] = new Array(months.length).fill(''); // Initialize empty array for months
          }

          const monthIndex = months.indexOf(month); // Get month index
          if (monthIndex !== -1) {
            feeDataMap[fee_head][monthIndex] = amount; // Assign amount to the correct month
          }
        });

        // Populate the table dynamically
        const tableBody = document.querySelector('#student_fee_table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        // Iterate over feeDataMap to create rows
        Object.keys(feeDataMap).forEach(feeHead => {
          const row = document.createElement('tr');
          row.classList.add('text-center');

          // Fee Head Column
          const feeHeadCell = document.createElement('td');
          feeHeadCell.textContent = feeHead;
          row.appendChild(feeHeadCell);

          // Amount Columns for Each Month
          feeDataMap[feeHead].forEach(amount => {
            const amountCell = document.createElement('td');
            amountCell.textContent = amount || ''; // Leave empty if no amount
            row.appendChild(amountCell);
          });

          // Append the row to the table body
          tableBody.appendChild(row);
        });
      } else {
        console.error('No data found');
      }
    })
    .catch(error => console.error('Error fetching fee plans:', error));
}
