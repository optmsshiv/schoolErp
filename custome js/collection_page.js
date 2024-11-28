document.addEventListener('DOMContentLoaded', function () {
  // Retrieve the student data from session storage
  const studentData = JSON.parse(sessionStorage.getItem('studentData'));

  if (studentData && studentData.length > 0) {
    populateFeeTable(studentData);
  } else {
    console.error('No student data found in session storage.');
  }
});

function populateFeeTable(data) {
  const feeTable = document.querySelector('#student_fee_data tbody');
  feeTable.innerHTML = ''; // Clear existing rows

  // Iterate through the student data and create table rows
  data.forEach(student => {
    // Check if fee is generated for this student's class
    if (!isFeeGeneratedForClass(student.class_name)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Fee is not generated for the class: ${student.class_name}`,
      });
      return; // Skip further processing for this student if fee is not generated
    }

    const row1 = `
      <tr>
        <td class="fw-bold">Student's Name:</td>
        <td>${student.full_name}</td>
        <td class="fw-bold">Father's Name:</td>
        <td>${student.father_name}</td>
        <td class="fw-bold">Monthly Fee:</td>
        <td>${student.monthly_fee}</td>
      </tr>`;

    const row2 = `
      <tr>
        <td class="fw-bold">Class:</td>
        <td>${student.class_name}</td>
        <td class="fw-bold">Mother's Name:</td>
        <td>${student.mother_name}</td>
        <td class="fw-bold">Type:</td>
        <td>${student.day_hosteler}</td>
      </tr>`;

    const row3 = `
      <tr>
        <td class="fw-bold">Roll number:</td>
        <td>${student.roll_no}</td>
        <td class="fw-bold">Mobile:</td>
        <td>${student.phone}</td>
        <td class="fw-bold">Gender:</td>
        <td>${student.gender}</td>
      </tr>`;

    const row4 = `
      <tr>
          <td class="fw-bold">Hotel Fee:</td>
          <td>${student.hotel_fee}</td>
          <td class="fw-bold">Transport Fee:</td>
          <td>${student.transport_fee}</td>
      </tr>`;

    feeTable.insertAdjacentHTML('beforeend', row1 + row2 + row3 + row4);
  });
}

// Function to check if the fee is generated for the class (using sessionStorage or any condition)
function isFeeGeneratedForClass(className) {
  // You can replace this logic with your own fee-generation check (e.g., based on sessionStorage or API response)
  const feeGeneratedClasses = JSON.parse(sessionStorage.getItem('generatedFeeClasses')) || [];
  return feeGeneratedClasses.includes(className); // Check if the class is in the list of generated fee classes
}
