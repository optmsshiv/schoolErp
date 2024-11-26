document.addEventListener('DOMContentLoaded', function () {
  // Fetch student data when the page loads
  fetchStudentData();

  // Add event listener to the "Collect Fee" button
  const collectFeeBtn = document.getElementById('collect_fee_btn');
  if (collectFeeBtn) {
    collectFeeBtn.addEventListener('click', () => {
      const studentTable = document.getElementById('student_data');

      // Get the inner HTML of the table to pass it to the next page
      const tableHTML = studentTable.innerHTML;

      // Store the table HTML in session storage
      sessionStorage.setItem('studentDataTable', tableHTML);
    });
  }
});

function fetchStudentData() {
  fetch('../collectFeeStudentDetails/students_details.php')
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const table = document.querySelector('#student_data tbody');
        table.innerHTML = ''; // Clear existing rows

        // Create table rows
        data.forEach(student => {
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

          table.insertAdjacentHTML('beforeend', row1 + row2 + row3);
        });
      } else {
        console.log('No data found');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}
