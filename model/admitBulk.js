document.getElementById('submitButton').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent default form submission

  const tableData = [];
  const rows = document.querySelectorAll('#dataTable tbody tr');

  // Collect data from table rows
  rows.forEach(row => {
    const rowData = {
      serial_number: row.cells[0].innerText.trim(),
      first_name: row.cells[1].innerText.trim(),
      last_name: row.cells[2].innerText.trim(),
      phone: row.cells[3].innerText.trim(),
      email: row.cells[4].innerText.trim(),
      date_of_birth: row.cells[5].innerText.trim(),
      gender: row.cells[6].innerText.trim(),
      class_name: row.cells[7].innerText.trim(),
      category: row.cells[8].innerText.trim(),
      religion: row.cells[9].innerText.trim(),
      guardian: row.cells[10].innerText.trim(),
      handicapped: row.cells[11].innerText.trim(),
      father_name: row.cells[12].innerText.trim(),
      mother_name: row.cells[13].innerText.trim(),
      roll_no: row.cells[14].innerText.trim(),
      sr_no: row.cells[15].innerText.trim(),
      pen_no: row.cells[16].innerText.trim(),
      aadhar_no: row.cells[17].innerText.trim(),
      admission_no: row.cells[18].innerText.trim(),
      admission_date: row.cells[19].innerText.trim(),
      day_hosteler: row.cells[20].innerText.trim()
    };
    tableData.push(rowData);
  });

  // Show loading container and initialize progress
  const loadingContainer = document.getElementById('loadingContainer');
  loadingContainer.style.display = 'block'; // Show loading bar
  let progress = 0;
  updateProgress(progress);

  // Force a layout update to ensure loading bar appears
  requestAnimationFrame(() => {
    setTimeout(() => {
      // Simulate progress updates every 200ms up to 80%
      const progressInterval = setInterval(() => {
        if (progress < 80) {
          progress += 5;
          updateProgress(progress);
        }
      }, 200);

      // Perform data upload
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "../php/admit_bulk_submit.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      // Update progress to 100% when request completes
      xhr.onload = function () {
        clearInterval(progressInterval);
        updateProgress(100);

        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          document.getElementById('messageContainer').innerText = response.message;

          // Clear table data if upload was successful
          if (response.success) {
            document.querySelector('#dataTable tbody').innerHTML = '';
          }
        } else {
          document.getElementById('messageContainer').innerText = "Failed to upload data.";
        }

        // Hide loading container after completion
        setTimeout(() => {
          loadingContainer.style.display = 'none';
          document.getElementById('progressPercentage').innerText = '0%';
          document.getElementById('progressBar').value = 0;
        }, 2000);
      };

      // Send JSON data to server
      const serializedData = encodeURIComponent(JSON.stringify(tableData));
      xhr.send("tableData=" + serializedData);
    }, 100); // Small delay to allow layout update
  });

  // Function to update progress bar
  function updateProgress(value) {
    document.getElementById('progressBar').value = value;
    document.getElementById('progressPercentage').innerText = `${value}%`;
  }
});
