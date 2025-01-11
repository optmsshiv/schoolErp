document.getElementById('editButtonFather').addEventListener('click', function () {
  // Fetch data from the table
  const fatherName = document.querySelector('td:nth-child(3)').textContent.trim();
  const fatherPhone = document.querySelector('td:nth-child(6)').textContent.trim();
  const fatherEmail = document.querySelector('td:nth-child(9)').textContent.trim();
  const fatherOccupation = document.querySelector('tr:nth-child(2) td:nth-child(3)').textContent.trim();
  const fatherAadhar = document.querySelector('tr:nth-child(2) td:nth-child(9)').textContent.trim();
  const fatherIncome = document.querySelector('tr:nth-child(3) td:nth-child(3)').textContent.trim();

  // Populate modal fields
  document.getElementById('fatherName').value = fatherName;
  document.getElementById('fatherPhone').value = fatherPhone;
  document.getElementById('fatherEmail').value = fatherEmail;
  document.getElementById('fatherOccupation').value = fatherOccupation;
  document.getElementById('fatherAadhar').value = fatherAadhar;
  document.getElementById('fatherIncome').value = fatherIncome;

  // Show the modal
  const editModal = new bootstrap.Modal(document.getElementById('/html/profielOffcanvaEdit/father_details_edit_canva.html'));
  editModal.show();
});

document.getElementById('saveChanges').addEventListener('click', function () {
  // Save changes (example)
  const updatedData = {
    fatherName: document.getElementById('fatherName').value,
    fatherPhone: document.getElementById('fatherPhone').value,
    fatherEmail: document.getElementById('fatherEmail').value,
    fatherOccupation: document.getElementById('fatherOccupation').value,
    fatherAadhar: document.getElementById('fatherAadhar').value,
    fatherIncome: document.getElementById('fatherIncome').value,
  };

  console.log('Updated Data:', updatedData);

  // Close the modal
  const editModal = bootstrap.Modal.getInstance(document.getElementById('editFatherModal'));
  editModal.hide();
});
