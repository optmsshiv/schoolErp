document.addEventListener('DOMContentLoaded', function () {
  fetchStudentData();

  // Add event listener to the Collect Fee button
  const collectFeeButton = document.getElementById('collect_fee_btn');
  collectFeeButton.addEventListener('click', function (event) {
    const selectedStudent = sessionStorage.getItem('selectedStudent');
    if (!selectedStudent) {
      event.preventDefault(); // Prevent navigation if no student is selected
      alert('Please select a student before collecting the fee.');
    }
  });
});

function fetchStudentData() {
  fetch('../collectFeeStudentDetails/students_details.php')
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const table = document.querySelector('#student_data tbody');
        table.innerHTML = ''; // Clear existing rows

        // Create table rows
        data.forEach((student, index) => {
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

          const buttonRow = `
            <tr>
              <td colspan="6" class="text-center">
                <button class="btn btn-primary select-student-btn" data-index="${index}">Select Student</button>
              </td>
            </tr>`;

          table.insertAdjacentHTML('beforeend', row1 + row2 + row3 + buttonRow);
        });

        // Add event listeners to "Select Student" buttons
        document.querySelectorAll('.select-student-btn').forEach((button) => {
          button.addEventListener('click', function () {
            const studentIndex = this.getAttribute('data-index');
            handleStudentSelection(data[studentIndex]);
          });
        });
      } else {
        console.log('No data found');
      }
    })
    .catch((error) => console.error('Error fetching data:', error));
}

// Function to handle student selection
function handleStudentSelection(student) {
  console.log('Selected student:', student);

  // Save student details in session storage
  sessionStorage.setItem('selectedStudent', JSON.stringify(student));

  // Update the "Collect Fee" button style to indicate selection
  const collectFeeButton = document.getElementById('collect_fee_btn');
  collectFeeButton.classList.remove('btn-outline-primary');
  collectFeeButton.classList.add('btn-success');
  collectFeeButton.textContent = `Collect Fee for ${student.full_name}`;
}
