document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.getElementById('submitButton');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const dataTableBody = document.getElementById('dataTable').querySelector('tbody');

  // Ensure loading indicator is hidden initially
  loadingIndicator.style.display = 'none';

  // Add click event listener to the submit button
  submitButton.addEventListener('click', (event) => {
      event.preventDefault();

      // Show loading indicator when the submit button is clicked
      loadingIndicator.style.display = 'block';

      // Collect data from the table
      const dataToSend = [];
      dataTableBody.querySelectorAll('tr').forEach(row => {
          const rowData = [];
          row.querySelectorAll('td').forEach(cell => rowData.push(cell.textContent));
          dataToSend.push(rowData.slice(1)); // Skip S.No column
      });

      // Send the collected data to the server using fetch
      fetch('../php/admit_bulk_submit.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataToSend })
      })
      .then(response => response.json())
      .then(data => {
          // Hide the loading indicator after receiving the response
          loadingIndicator.style.display = 'none';

          if (data.success) {
              alert(data.message);
          } else {
              alert('Error: ' + data.message);
          }
      })
      .catch(error => {
          // Hide loading indicator if an error occurs
          loadingIndicator.style.display = 'none';
          console.error('Error:', error);
          alert('An error occurred while uploading the data.');
      });
  });
});
