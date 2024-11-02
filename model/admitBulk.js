document.getElementById('studentBulkData').addEventListener('submit', function(event) {
  // Prevent the default form submission
  event.preventDefault();

  // Gather table data
  let tableData = [];
  const tableRows = document.querySelectorAll('#dataTable tbody tr');

  tableRows.forEach(row => {
      const rowData = {};
      const cells = row.querySelectorAll('td');

      // Check if we have the correct number of cells
      if (cells.length >= 21) { // Ensure there are enough cells
          rowData['serial_number'] = cells[0].innerText; // Serial Number
          rowData['first_name'] = cells[1].innerText; // First Name
          rowData['last_name'] = cells[2].innerText; // Last Name
          rowData['phone'] = cells[3].innerText; // Phone
          rowData['email'] = cells[4].innerText; // Email
          rowData['date_of_birth'] = cells[5].innerText; // Date of Birth
          rowData['gender'] = cells[6].innerText; // Gender
          rowData['class_name'] = cells[7].innerText; // Class Name
          rowData['category'] = cells[8].innerText; // Category
          rowData['religion'] = cells[9].innerText; // Religion
          rowData['guardian'] = cells[10].innerText; // Guardian
          rowData['handicapped'] = cells[11].innerText === 'Yes'; // Handicapped
          rowData['father_name'] = cells[12].innerText; // Father Name
          rowData['mother_name'] = cells[13].innerText; // Mother Name
          rowData['roll_no'] = cells[14].innerText; // Roll No
          rowData['sr_no'] = cells[15].innerText; // SR No
          rowData['pen_no'] = cells[16].innerText; // PEN No
          rowData['aadhar_no'] = cells[17].innerText; // Aadhar No
          rowData['admission_no'] = cells[18].innerText; // Admission No
          rowData['admission_date'] = cells[19].innerText; // Admission Date
          rowData['day_hosteler'] = cells[20].innerText; // Day/Hosteler

          tableData.push(rowData);
      } else {
          console.warn('Row does not have the expected number of cells:', row);
      }
  });

  // Convert the table data to a JSON string
  document.getElementById('tableData').value = JSON.stringify(tableData);

  // Now submit the form
  this.submit();
});
