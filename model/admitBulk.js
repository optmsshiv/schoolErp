
document.getElementById('submitButton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Show loading overlay if implemented
  document.getElementById('loadingOverlay').style.display = 'flex';

  // Get form data
  const formData = new FormData(document.getElementById('studentBulkData'));

  // Collect data from table rows
  const tableData = [];
  const tableRows = document.querySelectorAll('#dataTable tbody tr');

  tableRows.forEach((row, index) => {
    const rowData = {
      sNo: row.cells[0].textContent,
      firstName: row.cells[1].textContent,
      lastName: row.cells[2].textContent,
      phone: row.cells[3].textContent,
      email: row.cells[4].textContent,
      dob: row.cells[5].textContent,
      gender: row.cells[6].textContent,
      className: row.cells[7].textContent,
      category: row.cells[8].textContent,
      religion: row.cells[9].textContent,
      guardian: row.cells[10].textContent,
      handicapped: row.cells[11].textContent,
      fatherName: row.cells[12].textContent,
      motherName: row.cells[13].textContent,
      rollNo: row.cells[14].textContent,
      srNo: row.cells[15].textContent,
      penNo: row.cells[16].textContent,
      aadharNo: row.cells[17].textContent,
      admissionNo: row.cells[18].textContent,
      admissionDate: row.cells[19].textContent,
      dayHosteler: row.cells[20].textContent
    };
    tableData.push(rowData);
  });

  // Send data to the server
  fetch('../php/admit_bulk_submit.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(text => {
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON response:', text);
      data = { success: false, message: 'Unexpected server response. Please try again.' };
    }

    // Hide loading overlay
    document.getElementById('loadingOverlay').style.display = 'none';

    if (data.success) {
      alert(data.message);
    } else {
      alert('Error: ' + data.message);
    }
  })
  .catch(error => {
    document.getElementById('loadingOverlay').style.display = 'none';
    console.error('Fetch error:', error);
    alert('An error occurred while submitting the data.');
  });
});

