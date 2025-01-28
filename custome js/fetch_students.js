$(function () {
  // State variables
  let currentPage = 1;
  let recordsPerPage = 10;
  let totalRecords = 0;
  let totalPages = 1;

  // Cache frequently accessed DOM elements
  const $searchBar = $('#search-bar');
  const $classSelect = $('#class-select');
  const $recordsPerPage = $('#records-per-page');
  const $tableBody = $('#student-table-body');
  const $totalRecords = $('#total-records');
  const $currentRecords = $('#current-records');
  const $totalPagesEl = $('#total-pages');
  const $currentPageEl = $('#current-page');
  const $prevPage = $('#prev-page');
  const $nextPage = $('#next-page');
  const $firstPage = $('#first-page');
  const $lastPage = $('#last-page');
  const $selectAll = $('#select-all');
  const $pageNumbers = $('#page-numbers');
  const $studentCredentialsBtn = $('#student-credentials'); // Button to send credentials

  // Utility functions for AJAX calls
  function ajaxRequest(url, data, callback, errorCallback) {
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      data: data,
      success: callback,
      error: function (xhr, status, error) {
        console.error('Error fetching data from:', url, status, error);
        if (errorCallback) errorCallback(xhr, status, error);
      }
    });
  }

  // Fetch available class names for the dropdown
  function fetchClasses() {
    ajaxRequest(
      '../php/fetch_classes_active_student.php',
      {},
      function (data) {
        // Populate class dropdown with available class names
        $classSelect.empty().append('<option value="All">All</option>'); // Default "All" option
        data.classes.forEach(className => $classSelect.append(`<option value="${className}">${className}</option>`));
        fetchStudents(); // Load student data after classes are populated
      },
      function () {
        $classSelect.append('<option value="">Error loading classes</option>');
      }
    );
  }

  // Fetch student data
  function fetchStudents(searchTerm = '', className = '') {
    const params = {
      search: searchTerm,
      page: currentPage,
      limit: recordsPerPage,
      class: className
    };

    ajaxRequest(
      '../php/fetch_active_student.php',
      params,
      function (data) {
        totalRecords = data.totalRecords;
        totalPages = Math.ceil(totalRecords / recordsPerPage);

        // Update record counts
        $totalRecords.text(totalRecords);
        $currentRecords.text(Math.min(recordsPerPage, totalRecords - (currentPage - 1) * recordsPerPage));
        $totalPagesEl.text(totalPages);

        // Sort students by roll_no in ascending order if a class is selected
        if (className !== 'All' && className !== '') {
          data.students.sort((a, b) => a.roll_no - b.roll_no);
        }

        renderTable(data.students);
        updatePaginationUI();
        updateSelectAllCheckbox();
      },
      function () {
        $tableBody.html("<tr><td colspan='9'>Error loading data. Please try again later.</td></tr>");
      }
    );
  }

  // Render table rows
  function renderTable(students) {
    $tableBody.empty();
    if (students.length > 0) {
      let srNo = (currentPage - 1) * recordsPerPage + 1;
      students.forEach(student => {
        const avatar = student.student_image || '../assets/img/avatars/default-avatar.png';
        const studentStatusClass = student.status === 'active' ? 'success' : 'danger';

        const studentRow = `
          <tr>
            <td><input type='checkbox' class='row-checkbox' data-user-id='${student.user_id}'></td>
            <td>${srNo++}</td>
            <td>
              <div class="d-flex align-items-center">
                <div class="avatar avatar-sm">
                  <img src="${avatar}" alt="avatar" class="rounded-circle" />
                </div>
                <div class="ms-2">
                  <h6 class="mb-0 ms-2">${student.first_name} ${student.last_name}</h6>
                </div>
              </div>
            </td>
            <td>${student.father_name}</td>
            <td>${student.class_name}</td>
            <td>${student.roll_no}</td>
            <td>${student.phone}</td>
            <td>${student.user_id}</td>
            <td>
              <span class="badge bg-label-${studentStatusClass}">${student.status}</span>
            </td>
            <td>
              <a href="javascript:;" class='tf-icons bx bx-show bx-sm me-2 text-primary view-student' data-user-id='${
                student.user_id
              }' title="View Student"></a>
              <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" title="Delete Student"></a>
              <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm me-2 text-warning" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
              <div class="dropdown-menu dropdown-menu-end">
                <a class="dropdown-item" href="javascript:;" id="studentSuspend" title="Suspend">Suspend</a>
              </div>
            </td>
          </tr>`;

        $tableBody.append(studentRow);
      });
    } else {
      $tableBody.html(`
        <tr>
          <td colspan="9" class="text-center" style="margin-top: 20px;">
            <h2 class="badge bg-danger text-center" style="display: block;">No records found</h2>
          </td>
        </tr>
      `);
    }
  }

  // Update pagination UI
  function updatePaginationUI() {
    $currentPageEl.text(currentPage);
    $prevPage.prop('disabled', currentPage === 1);
    $nextPage.prop('disabled', currentPage === totalPages);
    renderPageNumbers();
  }

  // Render page numbers
  function renderPageNumbers() {
    $pageNumbers.empty();

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      $pageNumbers.append(
        `<button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}">${i}</button>`
      );
    }

    if (endPage < totalPages) {
      $pageNumbers.append('<span class="btn btn-outline-primary disabled">...</span>');
      $pageNumbers.append(`<button class="btn btn-outline-primary">${totalPages}</button>`);
    }

    $pageNumbers.find('button').on('click', function () {
      const selectedPage = parseInt($(this).text());
      if (selectedPage !== currentPage) {
        currentPage = selectedPage;
        fetchStudents($searchBar.val(), $classSelect.val());
      }
    });
  }

  // Update "Select All" checkbox
  function updateSelectAllCheckbox() {
    const allCheckboxes = $tableBody.find('input[type="checkbox"]');
    const checkedCheckboxes = allCheckboxes.filter(':checked');

    $selectAll.prop('checked', checkedCheckboxes.length === allCheckboxes.length);
    $selectAll.prop('indeterminate', checkedCheckboxes.length > 0 && checkedCheckboxes.length < allCheckboxes.length);
  }

  // View student details
  function viewStudent(userId) {
    window.location.href = `studentInfo.html?user_id=${userId}`;
  }

  // Handle page change
  function changePage(page) {
    currentPage = page;
    fetchStudents($searchBar.val(), $classSelect.val());
  }

  // Send student credentials via WhatsApp
  function sendCredentials(userIds) {
    // Create an array of student names (for display purposes)
    let studentNames = [];
    const selectedCheckboxes = $tableBody.find('input[type="checkbox"]:checked');

    selectedCheckboxes.each(function () {
      const studentName = $(this).closest('tr').find('td:nth-child(3) h6').text();
      studentNames.push(studentName);
    });

    // Join the names into a string (you can format it as needed)
    const studentNamesList = studentNames.join(', ');

    fetch('/php/send_credentials.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ user_id: userIds })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Success message with SweetAlert2
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Credentials Message",
            text: `Message sent to ${studentNamesList} successfully!`,
            showConfirmButton: false,
            timer: 5000, // Timer set for 5 seconds
            toast: true,
            timerProgressBar: true, // Optional: shows a progress bar for the timer
             didOpen: () => {
               // This ensures that even if the page is scrolled, the alert stays visible at the top
               const popup = Swal.getPopup();
               popup.style.zIndex = 9999; // Ensure it's on top
               popup.style.position = 'fixed'; // Ensure fixed position at the top
               popup.style.top = '10px'; // Adjust the top offset (10px from the top)
               popup.style.left = '50%'; // Center the toast horizontally
               popup.style.transform = 'translateX(-50%)'; // Center it exactly
             }
          });
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
      });
  }



  // Event listeners
  $searchBar.on('input', () => fetchStudents($searchBar.val(), $classSelect.val()));
  $classSelect.on('change', () => fetchStudents($searchBar.val(), $classSelect.val()));
  $recordsPerPage.on('change', () => {
    recordsPerPage = parseInt($recordsPerPage.val());
    fetchStudents($searchBar.val(), $classSelect.val());
  });

  $prevPage.on('click', () => currentPage > 1 && changePage(currentPage - 1));
  $nextPage.on('click', () => currentPage < totalPages && changePage(currentPage + 1));
  $firstPage.on('click', () => currentPage > 1 && changePage(1));
  $lastPage.on('click', () => currentPage < totalPages && changePage(totalPages));

  $selectAll.on('change', function () {
    $tableBody.find('input[type="checkbox"]').prop('checked', this.checked);
  });

  $tableBody.on('change', 'input[type="checkbox"]', updateSelectAllCheckbox);

  // Event delegation for view button
  $tableBody.on('click', '.view-student', function () {
    const userId = $(this).data('user-id');
    viewStudent(userId);
  });

  // Send student credentials via WhatsApp
  $studentCredentialsBtn.on('click', function () {
    const selectedCheckboxes = $tableBody.find('input[type="checkbox"]:checked');
    if (selectedCheckboxes.length === 0) {
      alert('Please select a student first.');
      return;
    }

    const selectedUserIds = selectedCheckboxes
      .map(function () {
        return $(this).data('user-id');
      })
      .get();

    sendCredentials(selectedUserIds);
  });

  // Initial fetch
  fetchClasses(); // First, fetch and populate classes, then fetch students
});
