document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('student_search');
  const cardContainer = document.getElementById('card-container'); // Container for showing fee cards
  const feeCardsContainer = document.getElementById('fee-cards-container'); // Container for the fee cards

  // Initially hide the fee cards container
  feeCardsContainer.style.display = 'none';

  // Attach event listeners to the search input
  searchInput.addEventListener('focus', showCardContainer);
  searchInput.addEventListener('input', debounce(searchStudents, 300));

  // Attach event listener to the card container to show fee cards on click
  cardContainer.addEventListener('click', showFeeCards);
});

// Function to show the fee cards container when clicked
function showFeeCards() {
  const feeCardsContainer = document.getElementById('fee-cards-container');

  // Toggle display of the fee cards container
  feeCardsContainer.style.display = feeCardsContainer.style.display === 'none' ? 'block' : 'none';

  // Optionally, populate the fee cards here if not already done
  if (feeCardsContainer.innerHTML === '') {
    populateCards(feeDetails.cards); // Only populate if the container is empty
  }
}

// Function to populate the fee cards dynamically
function populateCards(cards) {
  const feeCardsContainer = document.getElementById('fee-cards-container');

  // Clear previous cards (if any)
  feeCardsContainer.innerHTML = '';

  cards.forEach((card) => {
    const cardHTML = `
      <div class="col-lg-3 col-md-6">
        <div class="border rounded p-4 d-flex justify-content-between align-items-center">
          <div>
            <h5 class="card-title fw-bold">${card.title}</h5>
            <p class="card-text">&#8377; ${card.amount}</p>
          </div>
          <i class="fas ${card.icon} fa-2x ms-auto"></i>
        </div>
      </div>
    `;
    feeCardsContainer.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// Function to show the card container
function showCardContainer() {
  const resultsContainer = document.getElementById('results');
  resultsContainer.style.display = 'block';
}

// Function to populate the student table with details
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
          <td class="fw-bold">Hotel Fee:</td>
          <td>${student.hotel_fee || ''}</td>
          <td class="fw-bold">Transport Fee:</td>
          <td>${student.transport_fee || ''}</td>
      </tr>
  `;
}

// Function to fetch and display search results
async function searchStudents() {
  const query = document.getElementById('student_search').value.trim();
  const resultsContainer = document.getElementById('results');

  // Show a loading indicator while fetching data
  resultsContainer.innerHTML = '<p class="text-info text-center">Loading...</p>';

  // Clear results if query is empty
  if (!query) {
      resultsContainer.innerHTML = '';
      return;
  }

  try {
      const response = await fetch(`../php/searchStudents/search_students.php?query=${encodeURIComponent(query)}`);
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

// Debounce function to limit API calls
function debounce(func, delay) {
  let debounceTimeout;
  return function (...args) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func(...args), delay);
  };
}

// Data structure for fee details (you can fetch this from a backend API)
const feeDetails = {
  cards: [
    { title: "Total Paid Amount", amount: 50000, icon: "fa-wallet" },
    { title: "Pending Amount", amount: 15000, icon: "fa-exclamation-circle" },
    { title: "Hostel Fee", amount: 10000, icon: "fa-bed" },
    { title: "Transport Fee", amount: 5000, icon: "fa-bus" },
  ],
  tableData: [
    {
      receiptId: "R001",
      month: "January",
      dueAmount: 2000,
      pendingAmount: 500,
      receivedAmount: 1500,
      totalAmount: 2000,
      status: "Paid",
    },
    {
      receiptId: "R002",
      month: "February",
      dueAmount: 2000,
      pendingAmount: 2000,
      receivedAmount: 0,
      totalAmount: 2000,
      status: "Pending",
    },
  ],
};
