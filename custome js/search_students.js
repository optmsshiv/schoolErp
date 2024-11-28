document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('student_search');
  const resultsContainer = document.getElementById('results');
  const feeCardsContainer = document.querySelector(".row.g-4"); // Fee cards container

  // Initially hide the fee cards
  feeCardsContainer.style.display = 'none';

  // Attach event listeners to the search input
  searchInput.addEventListener('focus', showCardContainer);
  searchInput.addEventListener('input', debounce(searchStudents, 300));

  // Attach event listener to the card container (results container)
  resultsContainer.addEventListener('click', showFeeCards);
});

// Function to show the results container (when user focuses on search input)
function showCardContainer() {
  const resultsContainer = document.getElementById('results');
  resultsContainer.style.display = 'block';
}

// Function to display the fee cards when the results container is clicked
function showFeeCards() {
  const feeCardsContainer = document.querySelector(".row.g-4");

  // Show fee cards
  feeCardsContainer.style.display = 'block';

  // Optionally, you can populate the fee cards here (if not done already)
  populateCards(feeDetails.cards);
}

// Function to populate the fee cards dynamically
function populateCards(cards) {
  const cardContainer = document.querySelector(".row.g-4");

  // Clear previous cards (if any)
  cardContainer.innerHTML = '';

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
    cardContainer.insertAdjacentHTML("beforeend", cardHTML);
  });
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

// Debounce function to limit API calls
function debounce(func, delay) {
  let debounceTimeout;
  return function (...args) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func(...args), delay);
  };
}
