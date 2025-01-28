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

    if (className === 'All') className = ''; // If class is 'All', don't filter by class

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

  // Function to handle sorting
  function sortTable(column) {
    if ($classSelect.val() === 'All') return; // Prevent sorting when 'All' is selected

    if (currentSortColumn === column) {
      // Toggle sorting direction
      sortAscending = !sortAscending;
    } else {
      // Set new column and reset to ascending order
      currentSortColumn = column;
      sortAscending = true;
    }

    // Update the sorting indicator in the UI (optional)
    $('th').removeClass('sorted-asc sorted-desc');
    const $column = $('th').filter(function () {
      return $(this).text().trim().toLowerCase().replace(' ', '_') === column;
    });

    $column.addClass(sortAscending ? 'sorted-asc' : 'sorted-desc');

    // Refetch students with updated sorting parameters
    fetchStudents($searchBar.val(), $classSelect.val());
  }

  // Event listeners for sorting
  $('th').on('click', function () {
    const column = $(this).data('column'); // Use the data-column attribute for the column name
    sortTable(column);
  });

  // Render table rows
  function renderTable(students) {
    $tableBody.empty();
    if (students.length > 0) {
      let sr_no = (currentPage - 1) * recordsPerPage + 1;
      students.forEach(student => $tableBody.append(renderStudentRow(student, sr_no++)));
    } else {
      $tableBody.html(`
        <tr>
        <td colspan="9" class="text-center" style="margin-top: 20px;">
          <h2 class="badge bg-danger text-center" style="display: block;">No records found</h2>
        </td>
        </tr>`);
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
          <a href="#" class="tf-icons bx bx-show bx-sm me-2 text-primary  view-student" title="View Student" data-user-id="${
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
    debounce(function () {
      currentPage = 1;
      fetchStudents($searchBar.val(), $classSelect.val());
    }, 500)
  );

  $classSelect.on('change', function () {
    currentPage = 1;
    fetchStudents($searchBar.val(), $classSelect.val());
  });

  $recordsPerPage.on('change', function () {
    recordsPerPage = parseInt($recordsPerPage.val(), 10);
    currentPage = 1;
    fetchStudents($searchBar.val(), $classSelect.val());
  });

  $prevPage.on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchStudents($searchBar.val(), $classSelect.val());
    }
  });

  $nextPage.on('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchStudents($searchBar.val(), $classSelect.val());
    }
  });

  $firstPage.on('click', function () {
    currentPage = 1;
    fetchStudents($searchBar.val(), $classSelect.val());
  });

  $lastPage.on('click', function () {
    currentPage = totalPages;
    fetchStudents($searchBar.val(), $classSelect.val());
  });

  fetchClasses();
});
