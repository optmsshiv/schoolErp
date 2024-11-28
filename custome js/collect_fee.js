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

  // Dynamically load fee details and table data
  fetchFeeDetails();
});

function fetchStudentData() {
  const loadingBar = document.getElementById('loading-bar'); // Reference to the loading bar
  const table = document.querySelector('#student_data tbody');

  // Show loading bar
  loadingBar.style.display = 'block';
  table.innerHTML = ''; // Clear existing rows

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
      table.innerHTML = '<tr><td colspan="6">Search student name for collect fee.</td></tr>';
    })
    .finally(() => {
      // Hide loading bar
      loadingBar.style.display = 'none';
    });
}

function fetchFeeDetails() {
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

  // Populate the fee details cards
  populateCards(feeDetails.cards);

  // Populate the fee details table
  populateTable(feeDetails.tableData);
}

// Function to populate cards
function populateCards(cards) {
  const cardContainer = document.querySelector(".row.g-4");
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

// Function to populate table
function populateTable(data) {
  const tableBody = document.querySelector("#optms tbody");
  data.forEach((row) => {
    const rowHTML = `
      <tr>
        <td>${row.receiptId}</td>
        <td>${row.month}</td>
        <td align="center">&#8377; ${row.dueAmount}</td>
        <td align="center">&#8377; ${row.pendingAmount}</td>
        <td align="center">&#8377; ${row.receivedAmount}</td>
        <td align="center">&#8377; ${row.totalAmount}</td>
        <td>
          <span class="badge ${
            row.status === "Paid"
              ? "bg-label-success"
              : "bg-label-danger"
          } me-1">${row.status}</span>
        </td>
        <td align="center">
          <div class="dropdown">
            <button class="btn text-muted p-0" type="button" id="dropdownMenuButton"
              data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bx bx-dots-vertical-rounded bx-sm"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li><a class="dropdown-item border-bottom" href="#">View Fee Receipt</a></li>
              <li><a class="dropdown-item border-bottom" href="#">Send Fee Receipt</a></li>
              <li><a class="dropdown-item border-bottom" href="#">Send Fee Message</a></li>
              <li><a class="dropdown-item" href="#">Delete</a></li>
            </ul>
          </div>
        </td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", rowHTML);
  });
}
