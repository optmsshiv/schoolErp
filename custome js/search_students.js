// Ensure DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('student_search');
  const resultsContainer = document.getElementById('results');

  // Attach event listeners to the search input
  searchInput.addEventListener('focus', () => showCardContainer(resultsContainer));
  searchInput.addEventListener('input', debounce(() => searchStudents(searchInput, resultsContainer), 300));
});

/**
 * Show the card container.
 * @param {HTMLElement} resultsContainer - The container for displaying search results.
 */
function showCardContainer(resultsContainer) {
  resultsContainer.style.display = 'block';
}

/**
 * Populate the student table with details.
 * @param {Object} student - The student object containing details.
 */
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
      <tr>
          <td class="fw-bold">Hostel Fee:</td>
          <td>${student.hostel_fee || ''}</td>
          <td class="fw-bold">Transport Fee:</td>
          <td>${student.transport_fee || ''}</td>
      </tr>
  `;
}

/**
 * Fetch and display search results.
 * @param {HTMLInputElement} searchInput - The search input element.
 * @param {HTMLElement} resultsContainer - The container for displaying search results.
 */
async function searchStudents(searchInput, resultsContainer) {
  const query = searchInput.value.trim();

  // Show a loading indicator while fetching data
  resultsContainer.innerHTML = '<p class="text-info text-center">Loading...</p>';

  // Clear results if query is empty
  if (!query) {
    resultsContainer.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`../php/searchStudents/search_students.php?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    resultsContainer.innerHTML = '';

    // Handle no results found
    if (data.length === 0) {
      resultsContainer.innerHTML = '<p class="text-danger text-center">This student does not exist.</p>';
      return;
    }

    // Display results as cards
    data.forEach(student => {
      const card = document.createElement('div');
      card.classList.add('student-card');
      card.innerHTML = `
          <h3>${student.first_name} ${student.last_name}</h3>
          <p>Father's Name: ${student.father_name}</p>
          <p>Class: ${student.class_name}</p>
          <p>Roll No: ${student.roll_no}</p>
      `;

      // Add click event to populate student table with details
      card.addEventListener('click', () => {
        populateStudentTable(student);
        resultsContainer.style.display = 'none'; // Hide the card container
      });

      resultsContainer.appendChild(card);
    });

    // Show the card container
    resultsContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching students:', error);
    resultsContainer.innerHTML = '<p class="text-danger text-center">Error fetching data. Please try again later.</p>';
  }
}

/**
 * Debounce function to limit API calls.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, delay) {
  let debounceTimeout;
  return function (...args) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func(...args), delay);
  };
}
