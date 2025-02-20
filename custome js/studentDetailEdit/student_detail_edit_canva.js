
// Handle the "Edit" button click
document.getElementById('editButton').addEventListener('click', function() {
   // Ensure that data is available
  if (!studentData) {
    console.error('Student data is not available');
    return;
  }

  const data = studentData;
  // Dynamically load the off-canvas content from the provided path
  fetch('/html/profielOffcanvaEdit/profileEditOffcanve.html')
    .then(response => response.text())
    .then(html => {
      // Check if off-canvas is already loaded in the DOM
      if (!document.getElementById('CustomEditOffcanvas')) {
        // Append the loaded HTML (off-canvas content) to the body
        document.body.insertAdjacentHTML('beforeend', html);
      }

      // Fill the form fields with existing student data (assuming `data` is defined)
      document.getElementById('editFirstName').value = data.first_name || '';
      document.getElementById('editLastName').value = data.last_name || '';
      document.getElementById('editEmail').value = data.email || '';
      document.getElementById('editPhone').value = data.phone || '';
      document.getElementById('editAadhar').value = data.aadhar_no || '';
      document.getElementById('editCategory').value = data.category || '';
      document.getElementById('editGender').value = data.gender || '';
      document.getElementById('editClass').value = data.class_name || '';
      document.getElementById('editRollNo').value = data.roll_no || '';
      document.getElementById('editReligion').value = data.religion || '';
      document.getElementById('editHandicapped').value = data.handicapped ? 'Yes' : 'No';
      document.getElementById('editGuardianName').value = data.guardian || '';
      document.getElementById('editDob').value = data.dob || '';
      document.getElementById('editAdmissionDate').value = data.admission_date || '';
      document.getElementById('editSrNo').value = data.sr_no || '';

      // Initialize and show the off-canvas
      const offcanvas = new bootstrap.Offcanvas(document.getElementById('CustomEditOffcanvas'));
      offcanvas.show();
    })
    .catch(error => {
      console.error('Error loading off-canvas:', error);
    });
});

// Handle form submission
document.addEventListener('submit', function(event) {
  if (event.target && event.target.id === 'editStudentForm') {
    event.preventDefault();

    // Capture updated data from the form fields
    const updatedData = {
      first_name: document.getElementById('editFirstName').value,
      last_name: document.getElementById('editLastName').value,
      email: document.getElementById('editEmail').value,
      phone: document.getElementById('editPhone').value,
      aadhar_no: document.getElementById('editAadhar').value,
      category: document.getElementById('editCategory').value,
      gender: document.getElementById('editGender').value,
      class_name: document.getElementById('editClass').value,
      roll_no: document.getElementById('editRollNo').value,
      religion: document.getElementById('editReligion').value,
      handicapped: document.getElementById('editHandicapped').value === 'Yes',
      guardian: document.getElementById('editGuardianName').value,
      dob: document.getElementById('editDob').value,
      admission_date: document.getElementById('editAdmissionDate').value,
      sr_no: document.getElementById('editSrNo').value,
    };

    // Process the updated data (send it to the server, log it, etc.)
    console.log(updatedData);

    // Optionally close the off-canvas after submission
    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('editOffcanvas'));
    offcanvas.hide();
  }
});
