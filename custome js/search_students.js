 // Show the card-container when the search bar gains focus
 function showCardContainer() {
  const resultsContainer = document.getElementById('results');
  resultsContainer.style.display = 'block';
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
          resultsContainer.innerHTML = '<p class="text-danger"> No students found.</p>';
          return;
      }

      data.forEach(student => {
          const card = document.createElement('div');
          card.classList.add('student-card');
          card.innerHTML = `
              <h3>${student.first_name} ${student.last_name}</h3>
              <p>Father's Name: ${student.father_name}</p>
              <p>Class: ${student.class_name}</p>
              <p>Roll No: ${student.roll_no}</p>
          `;
          resultsContainer.appendChild(card);
      });
  } catch (error) {
      console.error('Error fetching students:', error);
  }
}
