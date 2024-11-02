document.addEventListener("DOMContentLoaded", function () {
  const loadingIndicator = document.getElementById('loadingIndicator');
  const processButton = document.getElementById('processButton');
  const submitButton = document.getElementById('submitButton');
  const studentBulkDataForm = document.getElementById('studentBulkData');

  // Hide loading indicator initially
  loadingIndicator.style.display = 'none';

  // Event listener for the process button
  processButton.addEventListener('click', function () {
      // Perform any processing needed here (e.g., CSV validation)
      // For example, you can read the file and prepare the data to be sent
      const fileInput = document.getElementById('inputGroupFile01');
      const file = fileInput.files[0];

      if (!file) {
          alert("Please select a CSV file to process.");
          return;
      }

      // Read the CSV file and process it if needed
      const reader = new FileReader();
      reader.onload = function (event) {
          const csvData = event.target.result;
          // You can process the CSV data here and prepare it for submission
          console.log(csvData); // For debugging: log the CSV data

          // You can also enable the submit button after processing
          submitButton.disabled = false; // Enable submit button after processing
      };
      reader.readAsText(file);
  });

  // Event listener for form submission
  studentBulkDataForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent the default form submission

      loadingIndicator.style.display = 'block'; // Show loading indicator

      try {
          const formData = new FormData(this); // Collect form data
          const response = await fetch(this.action, {
              method: 'POST',
              body: formData // Send form data
          });

          if (!response.ok) {
              throw new Error(`Network error: ${response.status}`);
          }

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              loadingIndicator.style.display = 'none'; // Hide loading indicator

              if (data.success) {
                  alert(data.message);
                  // Optionally, reset the form or do other actions
                  studentBulkDataForm.reset();
              } else {
                  alert('Server error: ' + (data.message || 'Unknown error'));
              }
          } else {
              // Handle unexpected response types
              const html = await response.text();
              console.error("Received HTML instead of JSON:", html);
              throw new Error("Server returned HTML instead of JSON. See console for details.");
          }
      } catch (error) {
          loadingIndicator.style.display = 'none'; // Hide loading indicator
          console.error('An error occurred:', error.message);
          alert('An error occurred while uploading the data. Please check the console for more details.');
      }
  });
});
