document.addEventListener("DOMContentLoaded", function () {
  const loadingIndicator = document.getElementById('loadingIndicator');
  const processButton = document.getElementById('processButton');
  const submitButton = document.getElementById('submitButton');
  const studentBulkDataForm = document.getElementById('studentBulkData');
  const dataTable = document.getElementById('dataTable'); // Reference to your data table

  // Hide loading indicator initially
  loadingIndicator.style.display = 'none';

  // Event listener for the process button
  processButton.addEventListener('click', function () {
      const fileInput = document.getElementById('inputGroupFile01');
      const file = fileInput.files[0];

      if (!file) {
          alert("Please select a CSV file to process.");
          return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
          const csvData = event.target.result;
          console.log(csvData); // For debugging: log the CSV data
          parseCSVDataToTable(csvData); // Parse CSV data and display it in the table
      };
      reader.readAsText(file);
  });

  // Function to parse CSV data and populate the table
  function parseCSVDataToTable(csvData) {
      const rows = csvData.split("\n").map(row => row.split(","));
      const tbody = dataTable.querySelector("tbody");

      // Clear existing rows in the table body
      tbody.innerHTML = '';

      rows.forEach((row, index) => {
          if (row.length > 1 && row.some(cell => cell.trim() !== "")) { // Ignore empty rows
              const tr = document.createElement("tr");
              tr.innerHTML = `<td>${index + 1}</td>` + row.map(cell => `<td>${cell.trim()}</td>`).join("");
              tbody.appendChild(tr);
          }
      });
  }

  // Event listener for form submission
  studentBulkDataForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent the default form submission
      loadingIndicator.style.display = 'block'; // Show loading indicator

      try {
          const formData = new FormData();

          // Append table data as JSON
          const tableData = [];
          dataTable.querySelectorAll("tbody tr").forEach(row => {
              const rowData = [];
              row.querySelectorAll("td").forEach(cell => {
                  rowData.push(cell.innerText.trim());
              });
              tableData.push(rowData);
          });

          if (tableData.length === 0) {
              alert("No data to submit. Please process a CSV file first.");
              loadingIndicator.style.display = 'none'; // Hide loading indicator
              return;
          }

          formData.append("tableData", JSON.stringify(tableData));

          // Send data to the server
          const response = await fetch(studentBulkDataForm.action, {
              method: 'POST',
              body: formData
          });

          if (!response.ok) {
              throw new Error(`Network error: ${response.status}`);
          }

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
              const data = await response.json();

              if (data.success) {
                  alert(data.message);
                  studentBulkDataForm.reset();
                  dataTable.querySelector("tbody").innerHTML = ''; // Clear table
              } else {
                  alert('Server error: ' + (data.message || 'Unknown error'));
              }
          } else {
              const html = await response.text();
              console.error("Received HTML instead of JSON:", html);
              throw new Error("Server returned HTML instead of JSON. See console for details.");
          }
      } catch (error) {
          console.error('An error occurred:', error.message);
          alert('An error occurred while uploading the data. Please check the console for more details.');
      } finally {
          loadingIndicator.style.display = 'none'; // Hide loading indicator in all cases
      }
  });
});
