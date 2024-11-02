document.getElementById('studentBulkData').addEventListener('submitButton', function(event) {
  // Prevent the default form submission
  event.preventDefault();

  // Gather table data
  let tableData = [];
  const tableRows = document.querySelectorAll('#dataTable tbody tr');

  tableRows.forEach(row => {
      const rowData = {};
      const cells = row.querySelectorAll('td');

      // Collecting data from each cell, assuming they are in the right order
      rowData['serial_number'] = cells[1].innerText; // First Name
      rowData['first_name'] = cells[2].innerText; // Last Name
      rowData['last_name'] = cells[3].innerText; // Phone
      rowData['phone'] = cells[4].innerText; // Email
      rowData['email'] = cells[5].innerText; // Date of Birth
      rowData['date_of_birth'] = cells[6].innerText; // Gender
      rowData['gender'] = cells[7].innerText; // Class Name
      rowData['class_name'] = cells[8].innerText; // Category
      rowData['category'] = cells[9].innerText; // Religion
      rowData['religion'] = cells[10].innerText; // Guardian
      rowData['guardian'] = cells[11].innerText; // Handicapped
      rowData['handicapped'] = cells[12].innerText === 'Yes'; // Father Name
      rowData['father_name'] = cells[13].innerText; // Mother Name
      rowData['mother_name'] = cells[14].innerText; // Roll No
      rowData['roll_no'] = cells[15].innerText; // SR No
      rowData['sr_no'] = cells[16].innerText; // PEN No
      rowData['pen_no'] = cells[17].innerText; // Aadhar No
      rowData['aadhar_no'] = cells[18].innerText; // Admission No
      rowData['admission_no'] = cells[19].innerText; // Admission Date
      rowData['admission_date'] = cells[20].innerText; // Day/Hosteler
      rowData['day_hosteler'] = cells[21].innerText; // Day/Hosteler

      tableData.push(rowData);
  });

  // Convert the table data to a JSON string
  document.getElementById('tableData').value = JSON.stringify(tableData);

  // Now submit the form
  this.submit();
});
