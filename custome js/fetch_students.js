$(function () {
  let currentPage = 1;
  let recordsPerPage = 10;
  let totalRecords = 0;
  let totalPages = 1;

  // Function to fetch student data with optional search term
  function fetchStudents(searchTerm = '') {
    $.ajax({
      url: '../php/fetch_active_student.php',
      type: 'GET',
      dataType: 'json',
      data: {
        search: searchTerm,
        page: currentPage,
        limit: recordsPerPage
      },
      success: function (data) {
        totalRecords = data.totalRecords;
        totalPages = Math.ceil(totalRecords / recordsPerPage);
        $('#total-pages').text(totalPages);

        let tableBody = $('#student-table-body');
        tableBody.empty();

        if (data.students.length > 0) {
          let sr_no = (currentPage - 1) * recordsPerPage + 1;
          $.each(data.students, function (index, student) {
            tableBody.append(`<tr>
                                <td><input type='checkbox' class='row-checkbox'></td>
                                <td>${sr_no++}</td>
                                <td>${student.first_name} ${student.last_name}</td>
                                <td>${student.father_name}</td>
                                <td>${student.class_name}</td>
                                <td>${student.roll_no}</td>
                                <td>${student.phone}</td>
                                <td>${student.user_id}</td>
                                <td>
                                  <button class='btn btn-primary btn-sm'>Edit</button>
                                  <button class='btn btn-danger btn-sm'>Delete</button>
                                </td>
                              </tr>`);
          });
        } else {
          tableBody.append("<tr><td colspan='9'>No records found</td></tr>");
        }

        // Update pagination UI
        $('#current-page').text(currentPage);
        $('#prev-page').prop('disabled', currentPage === 1);
        $('#next-page').prop('disabled', currentPage === totalPages);

        // Display current page buttons with highlighting
        updatePageNumbers();

        // Update the "Select All" checkbox state
        updateSelectAllCheckbox();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data: ", status, error);
      }
    });
  }

  // Function to update page numbers
  function updatePageNumbers() {
    let pageNumbers = $('#page-numbers');
    pageNumbers.empty();

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.append(
        `<button class="btn ${i === currentPage ? 'btn-primary' : 'btn-light'}">${i}</button>`
      );
    }

    if (endPage < totalPages) {
      pageNumbers.append('<span class="btn btn-light disabled">...</span>');
      pageNumbers.append(`<button class="btn btn-light">${totalPages}</button>`);
    }

    // Event listener for page number buttons
    pageNumbers.find('button').on('click', function () {
      let selectedPage = parseInt($(this).text());
      if (selectedPage !== currentPage) {
        currentPage = selectedPage;
        fetchStudents($('#search-bar').val());
      }
    });
  }

  // Event listener for search bar
  $('#search-bar').on('input', function () {
    currentPage = 1;
    fetchStudents($(this).val());
  });

  $('#records-per-page').on('change', function () {
    recordsPerPage = parseInt($(this).val());
    currentPage = 1;
    fetchStudents($('#search-bar').val());
  });

  $('#prev-page').on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchStudents($('#search-bar').val());
    }
  });

  $('#next-page').on('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchStudents($('#search-bar').val());
    }
  });

  $('#first-page').on('click', function () {
    if (currentPage > 1) {
      currentPage = 1;
      fetchStudents($('#search-bar').val());
    }
  });

  $('#last-page').on('click', function () {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      fetchStudents($('#search-bar').val());
    }
  });

  // "Select All" checkbox functionality
  $('#select-all').on('change', function () {
    // Set all checkboxes in the table to match the "Select All" checkbox state
    $('#student-table-body input[type="checkbox"]').prop('checked', this.checked);
    // Update the appearance based on the state
    updateSelectAllAppearance(this.checked);
  });

  // Individual row checkbox functionality
  $('#student-table-body').on('change', 'input[type="checkbox"]', function () {
    const allCheckboxes = $('#student-table-body input[type="checkbox"]');
    const checkedCheckboxes = allCheckboxes.filter(':checked');

    if (checkedCheckboxes.length === 0) {
      $('#select-all').prop('checked', false).removeClass('mixed');
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
      $('#select-all').prop('checked', true).removeClass('mixed');
    } else {
      $('#select-all').prop('checked', true).addClass('mixed'); // Mixed state
    }

    // Update the appearance based on the mixed state
    updateSelectAllAppearance($('#select-all').hasClass('mixed'));
  });

  // Function to update the appearance of the "Select All" checkbox
  function updateSelectAllAppearance(isMixed) {
    if (isMixed) {
      $('#select-all').addClass('mixed');
      $('#select-all').prop('indeterminate', true); // Set to mixed state
    } else {
      $('#select-all').removeClass('mixed');
      $('#select-all').prop('indeterminate', false); // Clear mixed state
    }
  }

  // Function to update the "Select All" checkbox state based on individual checkboxes
  function updateSelectAllCheckbox() {
    const allCheckboxes = $('#student-table-body input[type="checkbox"]');
    const checkedCheckboxes = allCheckboxes.filter(':checked');

    if (checkedCheckboxes.length === 0) {
      $('#select-all').prop('checked', false).removeClass('mixed');
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
      $('#select-all').prop('checked', true).removeClass('mixed');
    } else {
      $('#select-all').prop('checked', true).addClass('mixed'); // Mixed state
    }

    // Update the appearance based on the mixed state
    updateSelectAllAppearance($('#select-all').hasClass('mixed'));
  }

  fetchStudents(); // Initial fetch
});
