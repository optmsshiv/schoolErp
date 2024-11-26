document.addEventListener('DOMContentLoaded', function () {
  fetchFeePlansData();
});

function fetchFeePlansData() {
  fetch('../collectFeeStudentDetails/collection_page_fee_head.php') // Update this with your actual PHP path
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const table = document.querySelector('#student_fee_table');
        const thead = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');

        // Clear existing table contents
        tbody.innerHTML = '';
        thead.innerHTML = '<th>Fee Head</th>'; // Start with the "Fee Head" column

        // Create an array to store the months and fee heads data
        const feeHeads = {};
        const months = new Set(); // To collect unique months from the data

        // Loop through the data to organize fee amounts by fee head and month
        data.forEach(feePlan => {
          // Initialize the fee head object if it doesn't exist
          if (!feeHeads[feePlan.fee_head]) {
            feeHeads[feePlan.fee_head] = {
              April: '',
              May: '',
              June: '',
              July: '',
              Aug: '',
              Sept: '',
              Oct: '',
              Nov: '',
              Dec: '',
              Jan: '',
              Feb: '',
              March: ''
            };
          }

          // Set the amount for the respective month
          feeHeads[feePlan.fee_head][feePlan.month] = feePlan.amount;

          // Add the month to the set to track unique months
          months.add(feePlan.month);
        });

        // Convert the Set to an array and sort months to display them in order
        const sortedMonths = Array.from(months).sort((a, b) => {
          const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          return monthOrder.indexOf(a) - monthOrder.indexOf(b);
        });

        // Add month headers to the table dynamically
        sortedMonths.forEach(month => {
          const th = document.createElement('th');
          th.textContent = month;
          thead.appendChild(th);
        });

        // Loop through the fee heads and construct rows for the table
        for (const feeHead in feeHeads) {
          const feeData = feeHeads[feeHead];
          const row = document.createElement('tr');
          row.classList.add('text-center');

          // Add the Fee Head name
          const feeHeadCell = document.createElement('td');
          feeHeadCell.textContent = feeHead;
          row.appendChild(feeHeadCell);

          // Add the amounts for each month
          sortedMonths.forEach(month => {
            const amountCell = document.createElement('td');
            amountCell.textContent = feeData[month] || ''; // Display empty if no amount is found
            row.appendChild(amountCell);
          });

          // Append the row to the table body
          tbody.appendChild(row);
        }
      } else {
        console.log('No fee data found');
      }
    })
    .catch(error => console.error('Error fetching fee plans:', error));
}
