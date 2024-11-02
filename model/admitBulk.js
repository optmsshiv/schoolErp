document.getElementById('submitButton').addEventListener('click', function(e) {
  e.preventDefault();

  let table = document.getElementById('dataTable');
  let data = [];

  for (let i = 1, row; row = table.rows[i]; i++) {
    let rowData = {
      SNo: row.cells[0].innerText,
      firstName: row.cells[1].innerText,
      lastName: row.cells[2].innerText,
      phone: row.cells[3].innerText,
      email: row.cells[4].innerText,
      dob: row.cells[5].innerText,
      gender: row.cells[6].innerText,
      className: row.cells[7].innerText,
      category: row.cells[8].innerText,
      religion: row.cells[9].innerText,
      guardian: row.cells[10].innerText,
      handicapped: row.cells[11].innerText,
      fatherName: row.cells[12].innerText,
      motherName: row.cells[13].innerText,
      rollNo: row.cells[14].innerText,
      srNo: row.cells[15].innerText,
      penNo: row.cells[16].innerText,
      aadharNo: row.cells[17].innerText,
      admissionNo: row.cells[18].innerText,
      admissionDate: row.cells[19].innerText,
      dayHosteler: row.cells[20].innerText
    };
    data.push(rowData);
  }

  fetch('saveData.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});
