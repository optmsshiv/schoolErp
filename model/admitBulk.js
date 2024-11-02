document.getElementById('submitButton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default form submission

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

  // Populate the hidden input with the serialized table data
  document.getElementById('tableData').value = JSON.stringify(tableData);

  // Now submit the form
  document.getElementById('studentBulkData').submit(); // Submit the form
});
