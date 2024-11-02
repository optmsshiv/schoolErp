document.getElementById('submitButton').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent default form submission

  let table = document.getElementById('dataTable');
  let data = [];

  // Loop through table rows and collect data
  for (let i = 1; i < table.rows.length; i++) {
    let row = table.rows[i];
    let rowData = {
      serial_number: row.cells[0].innerText, // Change to match PHP column names
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
      handicapped: row.cells[11].innerText,
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
    data.push(rowData);
  }

  // Send collected data to PHP server
  fetch('../php/admit_bulk_submit.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return response.json();
  })
  .then(responseData => {
    // Handle successful response
    console.log('Success:', responseData);
    alert("Data submitted successfully!");
  })
  .catch((error) => {
    // Handle errors
    console.error('Error:', error);
    alert("Error submitting data.");
  });
});
