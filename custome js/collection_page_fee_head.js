document.addEventListener('DOMContentLoaded', function () {
  fetchFeePlansData();
});

function fetchFeePlansData() {
  fetch('../php/collectFeeStudentDetails/collection_page_fee_head.php') // Update with the correct path to your PHP script
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const table = document.querySelector('#student_fee_table tbody');
        table.innerHTML = ''; // Clear existing rows

        // Create a header row dynamically for the months
        const months = [
         'Fee Head', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'
        ];
        const headerRow = document.querySelector('#student_fee_table thead tr');
        months.forEach(month => {
          let th = document.createElement('th');
          th.textContent = month;
          headerRow.appendChild(th);
        });

        // Create a mapping of fee heads to their respective months and amounts
        const feeHeads = {};

        // Populate feeHeads map from data array
        data.forEach(record => {
          const feeHead = record.fee_head_name;
          const month = record.month_name;
          const amount = record.amount;

          // Initialize an array for fee head if not already initialized
          if (!feeHeads[feeHead]) {
            feeHeads[feeHead] = new Array(months.length).fill(''); // Initialize with empty values
          }

          // Get the index of the month and set the fee amount
          const monthIndex = months.indexOf(month);
          if (monthIndex !== -1) {
            feeHeads[feeHead][monthIndex] = amount;
          }
        });

        // Iterate over the fee heads and create rows for the table
        Object.keys(feeHeads).forEach(feeHead => {
          const row = document.createElement('tr');
          row.classList.add('text-center');

          // First column: Fee Head
          let feeHeadCell = document.createElement('td');
          feeHeadCell.textContent = feeHead;
          row.appendChild(feeHeadCell);

          // Create a cell for each month and populate the corresponding fee amount
          feeHeads[feeHead].forEach(amount => {
            const amountCell = document.createElement('td');
            amountCell.textContent = amount || ''; // If no amount, leave cell empty
            row.appendChild(amountCell);
          });

          // Append the row to the table body
          table.appendChild(row);
        });
      } else {
        console.log('No fee plans data found');
      }
    })
    .catch(error => console.error('Error fetching fee plans:', error));
}
