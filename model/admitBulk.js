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
        const response = await fetch('../php/admit_bulk_submit.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataToSend }),
        });

        // Check response status and handle unexpected content types
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();

            // Hide loading indicator
            loadingIndicator.style.display = 'none';

            if (data.success) {
                alert(data.message);
            } else {
                alert('Server error: ' + (data.message || 'Unknown error'));
            }
        } else {
            // Handle unexpected HTML response for debugging
            const html = await response.text();
            console.error("Expected JSON but received HTML:", html);
            throw new Error("The server returned HTML instead of JSON. Check server logs for PHP errors.");
        }
    } catch (error) {
        loadingIndicator.style.display = 'none';
        console.error('An error occurred:', error.message);
        alert('An error occurred while uploading the data. Please check the console for more details.');
    }


  });
});
