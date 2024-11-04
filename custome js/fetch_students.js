$(document).ready(function () {
  // Initialize DataTable with custom DOM positioning and options
  var table = $('#optms').DataTable({
    dom: '<"row"<"col-md-6"l><"col-md-6"B>>' + // Custom positioning for buttons and length menu
      't' +
      '<"row"<"col-md-6"i><"col-md-6"p>>',

    lengthMenu: [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, "All"]],
    pagingType: "full_numbers",
    responsive: true,
    ordering: false,  // Disable sorting for all columns
    pageLength: 5,
    language: {
      paginate: {
        first: "<<",
        last: ">>",
        next: ">",
        previous: "<"
      },
      lengthMenu: "Display _MENU_ records per page",
      info: "Showing page _PAGE_ of _PAGES_"
    },
    processing: true,
    serverSide: true,
    ajax: {
      url: '../php/fetch_active_student.php',
      type: 'GET',
      data: function (d) {
        d.page = currentPage - 1; // Send current page number to server
        d.recordsPerPage = recordsPerPage;
      },
      dataSrc: function (json) {
        totalRecords = json.totalRecords; // Assuming server sends total records count
        totalPages = Math.ceil(totalRecords / recordsPerPage);
        $('#total-pages').text(totalPages); // Update total pages display
        return json.data; // Server should return data array under `data` key
      }
    },
  });

  // Custom search input for student table
  $('#searchBox').on('keyup', function () {
    table.search(this.value).draw();
  });

  // Initialize custom pagination variables
  let currentPage = 1;
  let recordsPerPage = 10;
  let totalRecords = 0;
  let totalPages = 1;

  // Function to fetch student data with pagination controls
  function fetchStudents() {
    $.ajax({
      url: '../php/fetch_active_student.php',
      type: 'GET',
      dataType: 'json',
      data: { page: currentPage, recordsPerPage: recordsPerPage },
      success: function (data) {
        totalRecords = data.totalRecords;
        totalPages = Math.ceil(totalRecords / recordsPerPage);
        $('#total-pages').text(totalPages); // Update total pages display

        let tableBody = $('#student-table-body');
        tableBody.empty(); // Clear existing table data

        if (data.data.length > 0) {
          let sr_no = (currentPage - 1) * recordsPerPage + 1;
          $.each(data.data, function (index, student) {
            tableBody.append(`<tr>
                                <td><input type='checkbox'></td>
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

        $('#current-page').text(currentPage);
        $('#prev-page').prop('disabled', currentPage === 1);
        $('#next-page').prop('disabled', currentPage === totalPages);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data: ", status, error);
      }
    });
  }

  // Event listener for records per page change
  $('#records-per-page').on('change', function () {
    recordsPerPage = parseInt($(this).val());
    currentPage = 1; // Reset to first page
    fetchStudents(); // Fetch data again
  });

  // Event listener for pagination buttons
  $('#prev-page').on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchStudents();
    }
  });

  $('#next-page').on('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchStudents();
    }
  });

  // Fetch student data on page load
  fetchStudents();
});
