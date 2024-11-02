document.addEventListener("DOMContentLoaded", function () {
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'none'; // Ensure hidden immediately on load

  const processButton = document.getElementById('processButton');
  const studentBulkDataForm = document.getElementById('studentBulkData');
  const dataTable = document.getElementById('dataTable');

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
          parseCSVDataToTable(csvData);
      };
      reader.readAsText(file);
  });

  function parseCSVDataToTable(csvData) {
      const rows = csvData.split("\n").map(row => row.split(","));
      const tbody = dataTable.querySelector("tbody");
      tbody.innerHTML = '';

      rows.forEach((row, index) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${index + 1}</td>` + row.map(cell => `<td>${cell.trim()}</td>`).join("");
          tbody.appendChild(tr);
      });
  }

  studentBulkDataForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      loadingIndicator.style.display = 'flex';

      try {
          const formData = new FormData();

          const tableData = [];
          dataTable.querySelectorAll("tbody tr").forEach(row => {
              const rowData = [];
              row.querySelectorAll("td").forEach(cell => rowData.push(cell.innerText.trim()));
              tableData.push(rowData);
          });

          formData.append("tableData", JSON.stringify(tableData));

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
                  dataTable.querySelector("tbody").innerHTML = '';
              } else {
                  alert('Server error: ' + (data.message || 'Unknown error'));
              }
          } else {
              const html = await response.text();
              console.error("Received HTML instead of JSON:", html);
              throw new Error("Server returned HTML instead of JSON.");
          }
      } catch (error) {
          console.error('An error occurred:', error.message);
          alert('An error occurred while uploading the data. Please check the console for details.');
      } finally {
          loadingIndicator.style.display = 'none';
      }
  });
});
