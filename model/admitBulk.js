document.getElementById('studentBulkData').addEventListener('submit', function(event) {
  // Prevent the default form submission
  event.preventDefault();

  // Gather table data
  let tableData = [];
  const tableRows = document.querySelectorAll('#dataTable tbody tr');

  tableRows.forEach(row => {
      const rowData = {};
      const cells = row.querySelectorAll('td');

      // Collecting data from each cell, assuming they are in the right order
      rowData['serial_number'] = cells[1].innerText; // Seriial Number
      rowData['first_name'] = cells[2].innerText; // First Name
      rowData['last_name'] = cells[3].innerText; // Last Name
      rowData['phone'] = cells[4].innerText; // Phone
      rowData['email'] = cells[5].innerText; // Email
      rowData['date_of_birth'] = cells[6].innerText; // Date of Birth
      rowData['gender'] = cells[7].innerText; // Gender
      rowData['class_name'] = cells[8].innerText; // Class Name
      rowData['category'] = cells[9].innerText; // Category
      rowData['religion'] = cells[10].innerText; // Religion
      rowData['guardian'] = cells[11].innerText; // Guardian
      rowData['handicapped'] = cells[12].innerText === 'Yes'; // Handicapped
      rowData['father_name'] = cells[13].innerText; // Father Name
      rowData['mother_name'] = cells[14].innerText; // Mother Name
      rowData['roll_no'] = cells[15].innerText; // Roll No
      rowData['sr_no'] = cells[16].innerText; // SR No
      rowData['pen_no'] = cells[17].innerText; // PEN No
      rowData['aadhar_no'] = cells[18].innerText; // Aadhar No
      rowData['admission_no'] = cells[19].innerText; // Admission No
      rowData['admission_date'] = cells[20].innerText; // Admission Date
      rowData['day_hosteler'] = cells[21].innerText; // Day/Hosteler

      tableData.push(rowData);
  });

  // Convert the table data to a JSON string
  document.getElementById('tableData').value = JSON.stringify(tableData);

  // Now submit the form
  this.submit();
});
