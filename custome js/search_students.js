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
  if (resultsContainer) {
    resultsContainer.style.display = 'block'; // Show the container when the input is focused
  } else {
    console.error('Results container not found.');
  }
}

/**
 * Populate the student table with details.
 * @param {Object} student - The student object containing details.
 */
function populateStudentTable(student) {
  const studentTable = document.getElementById('student_data').querySelector('tbody');

  // Clear old data first
  studentTable.innerHTML = '';

  // Populate new data
  studentTable.innerHTML = `
      <tr>
          <td class="fw-bold">Student's Name:</td>
          <td>${student.first_name || ''} ${student.last_name || ''}</td>
          <td class="fw-bold">Father's Name:</td>
          <td>${student.father_name || 'N/A'}</td>
          <td class="fw-bold">Monthly Fee:</td>
          <td>${student.monthly_fee || 'N/A'}</td>
      </tr>
      <tr>
          <td class="fw-bold">Class:</td>
          <td>${student.class_name || 'N/A'}</td>
          <td class="fw-bold">Mother's Name:</td>
          <td>${student.mother_name || 'N/A'}</td>
          <td class="fw-bold">Type:</td>
          <td>${student.type || 'N/A'}</td>
      </tr>
      <tr>
          <td class="fw-bold">Roll number:</td>
          <td>${student.roll_no || 'N/A'}</td>
          <td class="fw-bold">Mobile:</td>
          <td>${student.phone || 'N/A'}</td>
          <td class="fw-bold">Gender:</td>
          <td>${student.gender || 'N/A'}</td>
      </tr>
      <tr>
          <td class="fw-bold">Hostel Fee:</td>
          <td>${student.hostel_fee || 'N/A'}</td>
          <td class="fw-bold">Transport Fee:</td>
          <td>${student.transport_fee || 'N/A'}</td>
          <td class="fw-bold">User ID:</td>
          <td>${student.user_id || 'N/A'}</td>
      </tr>
  `;
}

/**
 * Fetch and display search results.
 * @param {HTMLInputElement} searchInput - The search input element.
 * @param {HTMLElement} resultsContainer - The container for displaying search results.
 */
async function searchStudents(searchInput, resultsContainer) {
  if (!searchInput || !resultsContainer) {
    console.error('Required elements not found');
    return;
  }
  const query = searchInput.value.trim();

  resultsContainer.innerHTML = '<p class="text-info text-center">Loading...</p>';

  if (!query) {
    resultsContainer.innerHTML = '';
    return;
  }

  // Clear previous fee details
  resetFeeDetails();

  try {
    const response = await fetch(`../php/searchStudents/search_students.php?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    resultsContainer.innerHTML = '';

    if (data.length === 0) {
      resultsContainer.innerHTML = '<p class="text-danger text-center">No students found.</p>';
      return;
    }

    data.forEach(student => {
      const card = document.createElement('div');
      card.classList.add('student-card');
      card.innerHTML = `
          <h3>${student.first_name || ''} ${student.last_name || ''}</h3>
          <p>Father's Name: ${student.father_name || 'N/A'}</p>
          <p>Class: ${student.class_name || 'N/A'}</p>
          <p>Roll No: ${student.roll_no || 'N/A'}</p>
      `;

      card.addEventListener('click', () => {
        populateStudentTable(student);
        fetchFeeDetails(student.user_id); // Fetch fee details on click
        resultsContainer.style.display = 'none';
      });

      resultsContainer.appendChild(card);
    });

    resultsContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching students:', error);
    resultsContainer.innerHTML = '<p class="text-danger text-center">Error fetching data. Please try again later.</p>';
  }
}

/**
 * Fetch fee details for a student and update the UI.
 * @param {number} userId - The user ID of the student.
 */
async function fetchFeeDetails(userId) {
  try {
    const response = await fetch(`../php/collectFeeStudentDetails/students_fee_details.php?user_id=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (!data || !data.summary) {
      console.error('No fee summary available for this user.');
      alert('No fee details found for the selected student.');
      return;
    }

    // Update fee cards
    document.getElementById('total_paid_amount').textContent = `₹ ${data.summary.total_paid_amount || '0'}`;
    document.getElementById('pending_amount').textContent = `₹ ${data.summary.pending_amount || '0'}`;
    document.getElementById('hostel_amount').textContent = `₹ ${data.summary.hostel_amount || '0'}`;
    document.getElementById('transport_amount').textContent = `₹ ${data.summary.transport_amount || '0'}`;

    // Update fee table
    const feeTableBody = document.getElementById('optms').querySelector('tbody');
    feeTableBody.innerHTML = data.details.map(detail => {
      const months = detail.month.split(',').map(month => month.trim()).join(', '); // Clean month data

      return `
        <tr>
          <td>${detail.receipt_no}</td>
          <td>${months}</td>
          <td align="center">₹ ${detail.due_amount || '0'}</td>
          <td align="center">₹ ${(parseFloat(detail.total_amount || 0) - parseFloat(detail.received_amount || 0)).toFixed(2)}</td>
          <td align="center">₹ ${detail.received_amount || '0'}</td>
          <td align="center">₹ ${detail.total_amount || '0'}</td>
          <td><span class="badge ${detail.status === 'Paid' ? 'bg-label-success' : 'bg-label-danger'}">${detail.status}</span></td>
          <td align="center">
            <div class="dropdown">
              <button class="btn text-muted p-0" type="button" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded bx-sm"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item border-bottom" href="#">View Fee Receipt</a></li>
                <li><a class="dropdown-item border-bottom" href="#">Send Fee Receipt</a></li>
                <li><a class="dropdown-item border-bottom" href="#">Send Fee Message</a></li>
                <li><a class="dropdown-item" href="#">Delete</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } catch (error) {
    console.error('Error fetching fee details:', error);
    alert('Error fetching fee details. Please try again later.');
  }
}

/**
 * Reset fee details UI to initial state.
 */
function resetFeeDetails() {
  document.getElementById('total_paid_amount').textContent = '₹ 0';
  document.getElementById('pending_amount').textContent = '₹ 0';
  document.getElementById('hostel_amount').textContent = '₹ 0';
  document.getElementById('transport_amount').textContent = '₹ 0';
  document.getElementById('optms').querySelector('tbody').innerHTML = '';
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
