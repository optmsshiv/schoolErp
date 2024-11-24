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
        $tableBody.append(`<tr>
          <td><input type='checkbox' class='row-checkbox'></td>
          <td>${sr_no++}</td>
          <td>${student.first_name} ${student.last_name}</td>
          <td>${student.father_name}</td>
          <td>${student.class_name}</td>
          <td>${student.roll_no}</td>
          <td>${student.phone}</td>
          <td>${student.user_id}</td>
          <td>
            <button class='btn btn-primary btn-sm view-student' data-user-id='${student.user_id}'>View</button>
            <button class='btn btn-danger btn-sm'>Delete</button>
          </td>
        </tr>`);
      });
    } else {
      $tableBody.html("<tr><td colspan='9'>No records found</td></tr>");
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
      $pageNumbers.append('<span class="btn btn-light disabled">...</span>');
      $pageNumbers.append(`<button class="btn btn-light">${totalPages}</button>`);
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
    viewStudent(userId); // Call updateStudent function
  });

  // Change page
  function changePage(page) {
    currentPage = page;
    fetchStudents($searchBar.val(), $classSelect.val());
  }

  // Initial fetch
  fetchStudents();
});
