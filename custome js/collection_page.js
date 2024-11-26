document.addEventListener('DOMContentLoaded', () => {
  const studentData = JSON.parse(sessionStorage.getItem('selectedStudent'));

  if (studentData) {
      populateFeeTable(studentData);
  } else {
      console.error('No student data found in session storage.');
  }
});

function populateFeeTable(student) {
  const feeTable = document.getElementById('student_fee_data').querySelector('tbody');
  feeTable.innerHTML = `
      <tr>
          <td class="fw-bold">Student's Name:</td>
          <td>${student.first_name} ${student.last_name}</td>
          <td class="fw-bold">Father's Name:</td>
          <td>${student.father_name || ''}</td>
          <td class="fw-bold">Monthly Fee:</td>
          <td>${student.monthly_fee || ''}</td>
      </tr>
      <tr>
          <td class="fw-bold">Class:</td>
          <td>${student.class_name || ''}</td>
          <td class="fw-bold">Mother's Name:</td>
          <td>${student.mother_name || ''}</td>
          <td class="fw-bold">Type:</td>
          <td>${student.type || ''}</td>
      </tr>
      <tr>
          <td class="fw-bold">Roll number:</td>
          <td>${student.roll_no || ''}</td>
          <td class="fw-bold">Mobile:</td>
          <td>${student.phone || ''}</td>
          <td class="fw-bold">Gender:</td>
          <td>${student.gender || ''}</td>
      </tr>
  `;
}
