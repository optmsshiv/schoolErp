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

          // Check response status and content type
          if (!response.ok) {
              throw new Error(`Network response was not ok. Status: ${response.status}`);
          }

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
              const data = await response.json();
              // Hide loading indicator
              loadingIndicator.style.display = 'none';

              if (data.success) {
                  alert(data.message);
              } else {
                  alert('Error from server: ' + (data.message || 'Unknown error'));
              }
          } else {
              // If response is not JSON
              throw new Error("Expected JSON response but received a different format.");
          }
      } catch (error) {
          // Hide loading indicator if an error occurs
          loadingIndicator.style.display = 'none';
          console.error('An error occurred:', error.message);
          alert('An error occurred while uploading the data. Please check the console for more details.');
      }
  });
});
