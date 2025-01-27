$(function () {
  let currentPage = 1;
  let recordsPerPage = 10;
  let totalRecords = 0;
  let totalPages = 1;

  // Cache frequently accessed elements
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

  // Fetch available class names for the dropdown
  function fetchClasses() {
    $.ajax({
      url: '../php/fetch_classes_active_student.php', // Your PHP endpoint to fetch class names
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        // Populate class dropdown with available class names
        $classSelect.empty(); // Clear any existing options
        $classSelect.append('<option value="All">All</option>'); // Default "All" option

        data.classes.forEach(function (className) {
          $classSelect.append(
            `<option value="${className}">${className}</option>`
          );
        });

        // Trigger fetchStudents to load student data after classes are populated
        fetchStudents();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching class names: ", status, error);
        $classSelect.append('<option value="">Error loading classes</option>');
      }
    });
  }

  // Fetch student data
  function fetchStudents(searchTerm = '', className = '') {
    $.ajax({
      url: '../php/fetch_active_student.php',
      type: 'GET',
      dataType: 'json',
      data: {
        search: searchTerm,
        page: currentPage,
        limit: recordsPerPage,
        class: className
      },
      success: function (data) {
        totalRecords = data.totalRecords;
        totalPages = Math.ceil(totalRecords / recordsPerPage);

        // Update record counts
        $totalRecords.text(totalRecords);
        $currentRecords.text(Math.min(recordsPerPage, totalRecords - (currentPage - 1) * recordsPerPage));
        $totalPagesEl.text(totalPages);

        // Populate table
        renderTable(data.students);

        // Update pagination
        updatePaginationUI();

        // Update "Select All" checkbox
        updateSelectAllCheckbox();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data: ", status, error);
        $tableBody.html("<tr><td colspan='9'>Error loading data. Please try again later.</td></tr>");
      }
    });
  }

  // Render table rows
  function renderTable(students) {
    $tableBody.empty();
    if (students.length > 0) {
      let sr_no = (currentPage - 1) * recordsPerPage + 1;
      students.forEach(student => {
        var avatar = student.student_image ? student.stident_image : '../assets/img/avatars/default-avatar.png';
        $tableBody.append(`<tr>
          <td><input type='checkbox' class='row-checkbox' data-user-id='${student.user_id}'></td>
          <td>${sr_no++}</td>
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
            <span class="badge bg-label-${student.status === 'Active' ? 'success' : 'danger'}">${student.status}</td>
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
        </tr>`);
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
    // Redirect to the studentinfo.html page with user_id as a query parameter
    window.location.href = `studentInfo.html?user_id=${userId}`;
  }

  // Event listeners for fetching and filtering data
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
    viewStudent(userId); // Call viewStudent function
  });

  // Change page
  function changePage(page) {
    currentPage = page;
    fetchStudents($searchBar.val(), $classSelect.val());
  }

  // Send student credentials via WhatsApp
  $studentCredentialsBtn.on('click', function () {
    const selectedCheckboxes = $tableBody.find('input[type="checkbox"]:checked');

    if (selectedCheckboxes.length === 0) {
      alert('Please select a student first.');
      return;
    }

    selectedCheckboxes.each(function () {
      const userId = $(this).data('user-id');

      // Send AJAX request
      fetch('/php/send_credentials.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ user_id: userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('WhatsApp message sent successfully!');
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An unexpected error occurred.');
        });
    });
  });

  // Initial fetch
  fetchClasses(); // First, fetch and populate classes, then fetch students
});
