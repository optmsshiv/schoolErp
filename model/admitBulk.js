document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('submitButton');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const dataTableBody = document.getElementById('dataTable').querySelector('tbody');

  // Ensure loading indicator is hidden initially
  loadingIndicator.style.display = 'none';

  // Add click event listener to the submit button
  submitButton.addEventListener('click', async (event) => {
      event.preventDefault();

      // Show loading indicator when submit button is clicked
      loadingIndicator.style.display = 'block';

      // Collect data from the table
      const dataToSend = [];
      dataTableBody.querySelectorAll('tr').forEach((row) => {
          const rowData = [];
          row.querySelectorAll('td').forEach((cell) => rowData.push(cell.textContent));
          dataToSend.push(rowData.slice(1)); // Skip S.No column
      });

      try {
          // Send the collected data to the server using fetch
          const response = await fetch('../php/admit_bulk_submit.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: dataToSend }),
          });

          // Check if the response is JSON
          const contentType = response.headers.get("content-type");
          let data;
          if (contentType && contentType.indexOf("application/json") !== -1) {
              data = await response.json();
          } else {
              throw new Error("Response is not valid JSON.");
          }

          // Hide the loading indicator
          loadingIndicator.style.display = 'none';

          if (data.success) {
              alert(data.message);
          } else {
              alert('Error: ' + data.message);
          }
      } catch (error) {
          // Hide loading indicator if an error occurs
          loadingIndicator.style.display = 'none';
          console.error('Error:', error);
          alert('An error occurred while uploading the data.');
      }
  });
});
