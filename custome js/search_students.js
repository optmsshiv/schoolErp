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

    // Loop through students and create cards
    data.forEach(student => {
      const card = document.createElement('div');
      card.classList.add('student-card');
      card.innerHTML = `
          <h3>${student.first_name || ''} ${student.last_name || ''}</h3>
          <p>Father's Name: ${student.father_name || 'N/A'}</p>
          <p>Class: ${student.class_name || 'N/A'}</p>
          <p>Roll No: ${student.roll_no || 'N/A'}</p>
          <p>User ID: ${student.user_id}</p>
      `;

      // Add a click event listener to each card
      card.addEventListener('click', () => {
        // console.log('Clicked student:', student); // Log the student to confirm
        populateStudentTable(student); // Populate student details
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
    const response = await fetch(
      `../php/collectFeeStudentDetails/students_fee_details.php?user_id=${encodeURIComponent(userId)}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (!data || !data.summary) {
      console.error('No fee summary available for this user.');
      alert('No fee details found for the selected student.');
      return;
    }

    // Use the fetched data here
    // console.log(data); // For debugging

    // Calculate total pending amount from table data
    const totalPendingAmount = data.details.reduce((sum, detail) => {
      if (detail.status === 'Paid') {
        // Add 'due_amount' for Paid status
        return sum + parseFloat(detail.due_amount || 0);
      } else if (detail.status === 'Pending') {
        // Add 'total_amount' for Pending status
        return sum + parseFloat(detail.total_amount || 0);
      }
      return sum; // For any other status, do nothing
    }, 0);
    // Update the UI with the calculated total pending amount

    // Update fee cards
    document.getElementById('total_paid_amount').textContent = `₹ ${data.summary.total_paid_amount || '0'}`;
    document.getElementById('pending_amount').textContent = `₹ ${totalPendingAmount.toFixed(2)}`;
    document.getElementById('hostel_amount').textContent = `₹ ${data.summary.hostel_amount || '0'}`;
    document.getElementById('transport_amount').textContent = `₹ ${data.summary.transport_amount || '0'}`;

    // Update fee table
    const feeTableBody = document.getElementById('optms').querySelector('tbody');
    feeTableBody.innerHTML = data.details
      .map(detail => {
        const months = detail.month
          .split(',')
          .map(month => month.trim())
          .join(', '); // Clean month data

        return `
        <tr>
          <td>${detail.receipt_no}</td>
          <td>${months}</td>
          <td align="center">₹ ${detail.due_amount || '0'}</td>

          <td align="center">
        ${
          detail.status === 'Pending'
            ? `₹ ${(parseFloat(detail.total_amount || 0) - parseFloat(detail.received_amount || 0)).toFixed(2)}`
            : '—'
        }
      </td>
          <td align="center">₹ ${detail.received_amount || '0'}</td>
          <td align="center">₹ ${detail.total_amount || '0'}</td>
          <td><span class="badge rounded-pill ${detail.status === 'Paid' ? 'bg-label-success' : 'bg-label-danger'}">${
          detail.status
        }</span></td>
          <td align="center">
            <div class="dropdown">
              <button class="btn text-muted p-0" type="button" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded bx-sm"></i>
              </button>
              <ul class="dropdown-menu">
                ${
                  detail.status === 'Pending'
                    ? `<li><a class="dropdown-item border-bottom" href="javascript:void(0);" id="collectFeeLink">Collect Fee</a></li>`
                    : ''
                }
                <li><a class="dropdown-item border-bottom" href="javascript:void(0);" id="viewFeeReceiptLink">View Fee Receipt</a></li>
                <li><a class="dropdown-item border-bottom" href="javascript:void(0);" id="sendFeeReceiptLink">Send Fee Receipt</a></li>
                <li><a class="dropdown-item border-bottom" href="javascript:void(0);" id="sendFeeMessageLink">Send Fee Message</a></li>
                <li><a class="dropdown-item" href="javascript:void(0);" id="deleteFeeLink">Delete</a></li>
              </ul>
              <!-- Placeholder for Modal -->
               <div id="modalContainer"></div>
            </div>
          </td>
        </tr>
      `;
      })
      .join('');

    // Event delegation for dynamically added elements
    feeTableBody.addEventListener('click', function (event) {
      const target = event.target;
      const row = target.closest('tr'); // Get the clicked row

      if (target.closest('#deleteFeeLink')) {
        handleDelete(row);
      } else if (target.closest('#sendFeeReceiptLink')) {
        handleSendReceipt(row);
      } else if (target.closest('#sendFeeMessageLink')) {
        handleSendMessage(row);
      }
    });

    // 🔴 Function to delete a fee entry
    function handleDelete(row) {
      const receiptNo = row.querySelector('td:first-child').innerText;

      if (!confirm(`Are you sure you want to delete Receipt No: ${receiptNo}?`)) return;

      fetch('../php/searchStudents/delete_fee.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt_no: receiptNo })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            row.remove(); // Remove row from the table
            alert('✅ Fee record deleted successfully.');
          } else {
            alert('❌ Failed to delete fee record.');
          }
        })
        .catch(error => console.error('Error:', error));
    }

    // 📜 Function to send fee receipt via WhatsApp
    function handleSendReceipt(row) {
      const receiptNo = row.querySelector('td:first-child').innerText;

      fetch('../php/searchStudents/send_fee_receipt.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt_no: receiptNo })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('✅ Fee receipt sent successfully via WhatsApp.');
          } else {
            alert('❌ Failed to send fee receipt.');
          }
        })
        .catch(error => console.error('Error:', error));
    }

    // 📩 Function to send fee reminder message via WhatsApp
    function handleSendMessage(row) {
      const receiptNo = row.querySelector('td:first-child').innerText;

      fetch('../php/searchStudents/send_fee_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt_no: receiptNo })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('✅ Fee reminder sent successfully via WhatsApp.');
          } else {
            alert('❌ Failed to send fee reminder.');
          }
        })
        .catch(error => console.error('Error:', error));
    }

    // Attach the click event listener for 'View Fee Receipt' link
    document.querySelectorAll('#viewFeeReceiptLink').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        // Load and display the modal dynamically
        loadFeeReceiptModal();
      });
    });
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


// Function to dynamically load and show the modal
function loadFeeReceiptModal() {
  // Fetch the modal HTML file and load it into the modalContainer
  fetch('/html/model/fee_reciept_paid.html') // Replace with the correct path to your modal HTML file
    .then(response => response.text())
    .then(modalHTML => {
      // Insert the modal content into the modalContainer
      document.getElementById('modalContainer').innerHTML = modalHTML;

      // Initialize and show the modal using Bootstrap
      const modalElement = new bootstrap.Modal(document.getElementById('viewFeeReceiptModal'));
      modalElement.show();
    })
    .catch(error => {
      console.error('Error loading modal HTML:', error);
      alert('There was an error loading the modal.');
    });
}
