document.addEventListener('DOMContentLoaded', function () {
  // Fetch and populate student data when the page loads
  fetchStudentData();

  // Add event listener for the "Collect Fee" button
  document.getElementById('collect_fee_btn').addEventListener('click', function () {
    // Get all rows from the table with ID "student_data"
    const tableRows = document.querySelectorAll('#student_data tbody tr');

    // Prepare an array to store student data
    const studentData = [];

    // Iterate through the rows and extract cell data
    for (let i = 0; i < tableRows.length; i += 4) {
      const student = {
        full_name: tableRows[i].querySelector('td:nth-child(2)').textContent.trim(),
        father_name: tableRows[i].querySelector('td:nth-child(4)').textContent.trim(),
        monthly_fee: tableRows[i].querySelector('td:nth-child(6)').textContent.trim(),
        class_name: tableRows[i + 1].querySelector('td:nth-child(2)').textContent.trim(),
        mother_name: tableRows[i + 1].querySelector('td:nth-child(4)').textContent.trim(),
        day_hosteler: tableRows[i + 1].querySelector('td:nth-child(6)').textContent.trim(),
        roll_no: tableRows[i + 2].querySelector('td:nth-child(2)').textContent.trim(),
        phone: tableRows[i + 2].querySelector('td:nth-child(4)').textContent.trim(),
        gender: tableRows[i + 2].querySelector('td:nth-child(6)').textContent.trim(),
        hotel_fee: tableRows[i + 3].querySelector('td:nth-child(2)').textContent.trim(),
        transport_fee: tableRows[i + 3].querySelector('td:nth-child(4)').textContent.trim(),
      };

      studentData.push(student);
    }

    // Save the student data in session storage
    sessionStorage.setItem('studentData', JSON.stringify(studentData));
  });
});

function fetchStudentData() {
  const loadingBar = document.getElementById('loading-bar'); // Reference to the loading bar
  const table = document.querySelector('#student_data tbody');

  // Show loading bar
    // Show loading bar if it exists
  if (loadingBar) {
    loadingBar.style.display = 'block';
  }
  
  table.innerHTML = ''; // Clear existing rows


  fetch('../php/collectFeeStudentDetails/students_fee_details.php')
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

          const row4 = `
              <tr>
                  <td class="fw-bold">Hotel Fee:</td>
                  <td>${student.hotel_fee}</td>
                  <td class="fw-bold">Transport Fee:</td>
                  <td>${student.transport_fee}</td>
              </tr>`;

              table.insertAdjacentHTML('beforeend', row1 + row2 + row3 + row4);
            });
          } else {
            table.innerHTML = '<tr><td colspan="6">No student data available</td></tr>';
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          table.innerHTML = '<tr><td colspan="6">Error loading data.</td></tr>';
        })
        .finally(() => {
          // Hide loading bar
          loadingBar.style.display = 'none';
        });
    }
