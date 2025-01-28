$(function () {
  let currentPage = 1;
  let recordsPerPage = 10;
  let totalRecords = 0;
  let totalPages = 1;
  let currentSortColumn = null;
  let sortAscending = true;
  let cachedClasses = null;

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
  const $studentCredentialsBtn = $('#student-credentials');

  // Fetch available class names for the dropdown
  function fetchClasses() {
    if (cachedClasses) {
      populateClassDropdown(cachedClasses);
      return;
    }

    $.ajax({
      url: '../php/fetch_classes_active_student.php',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        cachedClasses = data.classes;
        populateClassDropdown(data.classes);
      },
      error: function () {
        console.error('Error fetching class names');
        $classSelect.append('<option value="">Error loading classes</option>');
      }
    });
  }

  function populateClassDropdown(classes) {
    $classSelect.empty().append('<option value="All">All</option>');
    classes.forEach(className => $classSelect.append(`<option value="${className}">${className}</option>`));
    fetchStudents();
  }

  // Debounce function for search
  function debounce(func, delay) {
    let debounceTimeout;
    return function (...args) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Fetch student data
  function fetchStudents(searchTerm = '', className = '') {
    toggleLoading(true);

    if (className === 'All') className = '';

    $.ajax({
      url: '../php/fetch_active_student.php',
      type: 'GET',
      dataType: 'json',
      data: {
        search: searchTerm,
        page: currentPage,
        limit: recordsPerPage,
        class: className,
        sortColumn: currentSortColumn,
        sortOrder: sortAscending ? 'ASC' : 'DESC'
      },
      success: function (data) {
        toggleLoading(false);

        totalRecords = data.totalRecords;
        totalPages = Math.ceil(totalRecords / recordsPerPage);

        // Update record counts
        $totalRecords.text(totalRecords);
        $currentRecords.text(Math.min(recordsPerPage, totalRecords - (currentPage - 1) * recordsPerPage));
        $totalPagesEl.text(totalPages);

        renderTable(data.students);
        updatePaginationUI();
        updateSelectAllCheckbox();
      },
      error: function () {
        toggleLoading(false);
        $tableBody.html("<tr><td colspan='9'>Error loading data. Please try again later.</td></tr>");
      }
    });
  }

  // Render table rows
  function renderTable(students) {
    $tableBody.empty();
    if (students.length > 0) {
      let sr_no = (currentPage - 1) * recordsPerPage + 1;
      students.forEach(student => $tableBody.append(renderStudentRow(student, sr_no++)));
    } else {
      $tableBody.html(`<tr><td colspan="9" class="text-center">No records found</td></tr>`);
    }
  }

  function renderStudentRow(student, srNo) {
    const avatar = student.student_image || '../assets/img/avatars/default-avatar.png';
    return `
      <tr>
        <td><input type="checkbox" class="row-checkbox" data-user-id="${student.user_id}"></td>
        <td>${srNo}</td>
        <td>
          <div class="d-flex align-items-center">
            <img src="${avatar}" alt="avatar" class="avatar avatar-sm rounded-circle" />
            <span class="ms-2">${student.first_name} ${student.last_name}</span>
          </div>
        </td>
        <td>${student.father_name}</td>
        <td>${student.class_name}</td>
        <td>${student.roll_no}</td>
        <td>${student.phone}</td>
        <td>${student.user_id}</td>
        <td>
          <span class="badge bg-label-${student.status === 'active' ? 'success' : 'danger'}">${student.status}</span>
        </td>
        <td>
          <a href="#" class='tf-icons bx bx-show bx-sm me-2 text-primary  view-student" title="View Student" data-user-id="${
            student.user_id
          }"></a>
          <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" title="Delete Student"></a>
          <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm me-2 text-warning" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item" href="javascript:;" id="studentSuspend" title="Suspend">Suspend</a>
                </div>
        </td>
      </tr>`;
  }

  // Update pagination UI
  function updatePaginationUI() {
    $currentPageEl.text(currentPage);
    $prevPage.prop('disabled', currentPage === 1);
    $nextPage.prop('disabled', currentPage === totalPages);

    renderPageNumbers();
  }

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

  function toggleLoading(show) {
    if (show) {
      $tableBody.html('<tr><td colspan="9" class="text-center">Loading...</td></tr>');
    }
  }

  function updateSelectAllCheckbox() {
    const allCheckboxes = $tableBody.find('input[type="checkbox"]');
    const checkedCheckboxes = allCheckboxes.filter(':checked');

    $selectAll.prop('checked', checkedCheckboxes.length === allCheckboxes.length);
    $selectAll.prop('indeterminate', checkedCheckboxes.length > 0 && checkedCheckboxes.length < allCheckboxes.length);
  }

  // Event Listeners
  $searchBar.on(
    'input',
    debounce(() => fetchStudents($searchBar.val(), $classSelect.val()), 300)
  );
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
  $tableBody.on('click', '.view-student', function () {
    const userId = $(this).data('user-id');
    window.location.href = `studentInfo.html?user_id=${userId}`;
  });

  $studentCredentialsBtn.on('click', function () {
    const selectedCheckboxes = $tableBody.find('input[type="checkbox"]:checked');

    if (selectedCheckboxes.length === 0) {
      alert('Please select a student first.');
      return;
    }

    if (!confirm('Are you sure you want to send credentials to selected students?')) return;

    selectedCheckboxes.each(function () {
      const userId = $(this).data('user-id');

      fetch('/php/send_credentials.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ user_id: userId })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('WhatsApp message sent successfully!');
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An unexpected error occurred.');
        });
    });
  });

  function changePage(page) {
    currentPage = page;
    fetchStudents($searchBar.val(), $classSelect.val());
  }

  // Initial fetch
  fetchClasses();
});
