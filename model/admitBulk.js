document.getElementById('submitButton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Show loading overlay
  document.getElementById('loadingOverlay').style.display = 'flex';

  const tableData = [];
  const rows = document.querySelectorAll('#dataTable tbody tr');

  rows.forEach(row => {
    const rowData = {
      serial_number: row.cells[0].innerText,
      first_name: row.cells[1].innerText,
      last_name: row.cells[2].innerText,
      phone: row.cells[3].innerText,
      email: row.cells[4].innerText,
      date_of_birth: row.cells[5].innerText,
      gender: row.cells[6].innerText,
      class_name: row.cells[7].innerText,
      category: row.cells[8].innerText,
      religion: row.cells[9].innerText,
      guardian: row.cells[10].innerText,
      handicapped: row.cells[11].innerText === "Yes" ? 1 : 0,
      father_name: row.cells[12].innerText,
      mother_name: row.cells[13].innerText,
      roll_no: row.cells[14].innerText,
      sr_no: row.cells[15].innerText,
      pen_no: row.cells[16].innerText,
      aadhar_no: row.cells[17].innerText,
      admission_no: row.cells[18].innerText,
      admission_date: row.cells[19].innerText,
      day_hosteler: row.cells[20].innerText
    };
    tableData.push(rowData);
  });

  fetch('submit_data.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tableData)
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('loadingOverlay').style.display = 'none'; // Hide loading overlay
    alert(data.success ? 'Data submitted successfully!' : 'Failed to submit data.');
  })
  .catch(error => {
    document.getElementById('loadingOverlay').style.display = 'none'; // Hide loading overlay
    console.error('Error:', error);
    alert('An error occurred while submitting the data.');
  });
});
