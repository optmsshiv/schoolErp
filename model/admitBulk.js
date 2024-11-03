document.getElementById('submitButton').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent default form submission

  const loadingContainer = document.getElementById('loadingContainer');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');
  const messageContainer = document.getElementById('messageContainer');

  // Show the loading container
  loadingContainer.style.display = 'flex';

  // Reset progress bar and message container
  progressBar.value = 0;
  progressPercentage.innerText = '0%';
  messageContainer.innerText = '';

  // Collect table data (replace with your actual table data collection logic)
  const tableData = [];
  const rows = document.querySelectorAll('#dataTable tbody tr');
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

  // Simulated progress animation until upload completes
  let progress = 0;
  const interval = setInterval(() => {
    if (progress < 80) {  // Simulate loading up to 80% initially
      progress += 5;
      progressBar.value = progress;
      progressPercentage.innerText = `${progress}%`;
    }
  }, 200);

  // Send data to server via AJAX
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "../php/admit_bulk_submit.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    clearInterval(interval); // Stop the progress simulation
    progressBar.value = 100;  // Set progress to 100% upon completion
    progressPercentage.innerText = '100%';
    messageContainer.innerText = 'Data uploaded successfully!';

    // Hide loading container and reset form data after a short delay
    setTimeout(() => {
      loadingContainer.style.display = 'none';
      progressPercentage.innerText = '0%';
      progressBar.value = 0;
      document.getElementById('dataTable').querySelectorAll('tbody tr').forEach(row => row.remove()); // Clear table rows
    }, 2000);
  };

  xhr.onerror = function () {
    clearInterval(interval); // Stop progress on error
    loadingContainer.style.display = 'none';
    messageContainer.innerText = 'Error uploading data. Please try again.';
  };

  // Convert table data to JSON and send it to the server
  const serializedData = encodeURIComponent(JSON.stringify(tableData));
  xhr.send("tableData=" + serializedData);
});
