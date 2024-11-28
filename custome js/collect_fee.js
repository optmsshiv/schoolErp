document.addEventListener('DOMContentLoaded', function () {
  // Fetch and populate student data when the page loads
  fetchStudentData();

  // Add event listener for the "Collect Fee" button
  document.getElementById('collect_fee_btn').addEventListener('click', function () {
    // Select all rows from the table with ID "student_data"
    const tableRows = document.querySelectorAll('#student_data tbody tr');

    // Prepare an array to store student data
    const studentData = [];

    // Iterate through the rows and extract cell data in groups of 4
    try {
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
      console.log('Student data saved to sessionStorage:', studentData);

    } catch (error) {
      console.error('Error processing student data:', error);
      alert('Failed to process student data. Please check table structure.');
    }
  });
});

// Helper function to create table rows dynamically
function createTableRow(data) {
  return `
    <tr>
      <td class="fw-bold">${data.label1}</td>
      <td>${data.value1}</td>
      <td class="fw-bold">${data.label2}</td>
      <td>${data.value2}</td>
      <td class="fw-bold">${data.label3}</td>
      <td>${data.value3}</td>
    </tr>`;
}

function fetchStudentData() {
  const loader = document.getElementById('loader'); // Assume a loader is present
  if (loader) loader.style.display = 'block'; // Show loader

  fetch('../collectFeeStudentDetails/students_details.php')
    .then(response => response.json())
    .then(data => {
      const table = document.querySelector('#student_data tbody');
      table.innerHTML = ''; // Clear existing rows

      if (data.length > 0) {
        data.forEach(student => {
          // Add rows for each student
          table.insertAdjacentHTML('beforeend', createTableRow({
            label1: "Student's Name:",
            value1: student.full_name,
            label2: "Father's Name:",
            value2: student.father_name,
            label3: "Monthly Fee:",
            value3: student.monthly_fee
          }));

          table.insertAdjacentHTML('beforeend', createTableRow({
            label1: "Class:",
            value1: student.class_name,
            label2: "Mother's Name:",
            value2: student.mother_name,
            label3: "Type:",
            value3: student.day_hosteler
          }));

          table.insertAdjacentHTML('beforeend', createTableRow({
            label1: "Roll number:",
            value1: student.roll_no,
            label2: "Mobile:",
            value2: student.phone,
            label3: "Gender:",
            value3: student.gender
          }));

          table.insertAdjacentHTML('beforeend', createTableRow({
            label1: "Hotel Fee:",
            value1: student.hotel_fee,
            label2: "Transport Fee:",
            value2: student.transport_fee,
            label3: "",
            value3: ""
          }));
        });
      } else {
        // Display a message if no data is found
        table.innerHTML = '<tr><td colspan="6">No student data available</td></tr>';
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Failed to load student data. Please try again.');
    })
    .finally(() => {
      if (loader) loader.style.display = 'none'; // Hide loader
    });
}
