$(() => {
  let currentPage = 1;
  let recordsPerPage = 10;
  let totalRecords = 0; // This will hold the total number of records
  let totalPages = 1; // This will hold the total number of pages

  // Function to fetch student data
  function fetchStudents() {
      $.ajax({
          url: '../php/fetch_active_student.php', // The PHP file that returns student data
          type: 'GET',
          dataType: 'json',
          success: function(data) {
              totalRecords = data.length; // Update total records
              totalPages = Math.ceil(totalRecords / recordsPerPage); // Calculate total pages
              $('#total-pages').text(totalPages); // Update total pages display

              let tableBody = $('#student-table-body');
              tableBody.empty(); // Clear existing table data

              // Get the slice of data for the current page
              const startIndex = (currentPage - 1) * recordsPerPage;
              const endIndex = startIndex + recordsPerPage;
              const paginatedData = data.slice(startIndex, endIndex);

              if (paginatedData.length > 0) {
                  let sr_no = startIndex + 1; // Start serial number from the current page
                  $.each(paginatedData, function(index, student) {
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

              // Update pagination buttons
              $('#current-page').text(currentPage);
              $('#prev-page').prop('disabled', currentPage === 1);
              $('#next-page').prop('disabled', currentPage === totalPages);
          },
          error: function(xhr, status, error) {
              console.error("Error fetching data: ", status, error);
          }
      });
  }

  // Event listener for records per page change
  $('#records-per-page').on('change', function() {
      recordsPerPage = parseInt($(this).val());
      currentPage = 1; // Reset to first page
      fetchStudents(); // Fetch data again
  });

  // Event listener for pagination buttons
  $('#prev-page').on('click', function() {
      if (currentPage > 1) {
          currentPage--;
          fetchStudents();
      }
  });

  $('#next-page').on('click', function() {
      if (currentPage < totalPages) {
          currentPage++;
          fetchStudents();
      }
  });

  // Fetch student data on page load
  fetchStudents();
});
