// Show the card-container when the search bar gains focus
function showCardContainer() {
  const resultsContainer = document.getElementById('results');
  resultsContainer.style.display = 'block';
}

// Function to populate the student table
function populateStudentTable(student) {
  const studentTable = document.getElementById('student_data').querySelector('tbody');
  studentTable.innerHTML = `
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

// Function to fetch and display search results
async function searchStudents() {
  const query = document.getElementById('student_search').value;

  try {
      const response = await fetch(`../php/searchStudents/search_students.php?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      const resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = '';

      if (data.length === 0) {
          resultsContainer.innerHTML = '<p class="text-danger text-center">This student does not exist.</p>';
          return;
      }

      // Create cards for each student result
      data.forEach(student => {
          const card = document.createElement('div');
          card.classList.add('student-card');
          card.innerHTML = `
              <h3>${student.first_name} ${student.last_name}</h3>
              <p>Father's Name: ${student.father_name}</p>
              <p>Class: ${student.class_name}</p>
              <p>Roll No: ${student.roll_no}</p>
          `;

          // Add click event to fetch additional details and populate the table
          card.addEventListener('click', () => {
            populateStudentTable(student);
            resultsContainer.style.display = 'none'; // Hide the card container
        });

        resultsContainer.appendChild(card);
    });

    resultsContainer.style.display = 'block'; // Show the card container when results are added
} catch (error) {
    console.error('Error fetching students:', error);
}
}
