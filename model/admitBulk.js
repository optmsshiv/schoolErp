
document.getElementById('submitButton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default form submission

  const tableData = [];
  const rows = document.querySelectorAll('#dataTable tbody tr');

  rows.forEach(row => {
    const rowData = {};
    rowData.serial_number = row.cells[0].innerText;
    rowData.first_name = row.cells[1].innerText;
    rowData.last_name = row.cells[2].innerText;
    rowData.phone = row.cells[3].innerText;
    rowData.email = row.cells[4].innerText;
    rowData.date_of_birth = row.cells[5].innerText;
    rowData.gender = row.cells[6].innerText;
    rowData.class_name = row.cells[7].innerText;
    rowData.category = row.cells[8].innerText;
    rowData.religion = row.cells[9].innerText;
    rowData.guardian = row.cells[10].innerText;
    rowData.handicapped = row.cells[11].innerText === "Yes" ? 1 : 0;
    rowData.father_name = row.cells[12].innerText;
    rowData.mother_name = row.cells[13].innerText;
    rowData.roll_no = row.cells[14].innerText;
    rowData.sr_no = row.cells[15].innerText;
    rowData.pen_no = row.cells[16].innerText;
    rowData.aadhar_no = row.cells[17].innerText;
    rowData.admission_no = row.cells[18].innerText;
    rowData.admission_date = row.cells[19].innerText;
    rowData.day_hosteler = row.cells[20].innerText;

    tableData.push(rowData);
  });

  fetch('submit_data.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tableData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Data submitted successfully!');
    } else {
      alert('Failed to submit data.');
    }
  })
  .catch(error => console.error('Error:', error));
});

