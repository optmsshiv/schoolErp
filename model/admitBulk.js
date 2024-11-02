document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.getElementById('submitButton');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const dataTableBody = document.getElementById('dataTable').querySelector('tbody');

  // Hide loading indicator initially
  loadingIndicator.style.display = 'none';

  // Submit button - send table data to the server
  submitButton.addEventListener('click', (event) => {
      event.preventDefault();

      // Show loading indicator
      loadingIndicator.style.display = 'block';

      // Collect data from the table
      const dataToSend = [];
      dataTableBody.querySelectorAll('tr').forEach(row => {
          const rowData = [];
          row.querySelectorAll('td').forEach(cell => rowData.push(cell.textContent));
          dataToSend.push(rowData.slice(1)); // Skip S.No column
      });

      // Send data to the server
      fetch('../php/admit_bulk_submit.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataToSend })
      })
      .then(response => response.json())
      .then(data => {
          // Hide loading indicator after receiving response
          loadingIndicator.style.display = 'none';

          if (data.success) {
              alert(data.message);
          } else {
              alert('Error: ' + data.message);
          }
      })
      .catch(error => {
          // Hide loading indicator if there is an error
          loadingIndicator.style.display = 'none';
          console.error('Error:', error);
          alert('An error occurred while uploading the data.');
      });
  });
});
