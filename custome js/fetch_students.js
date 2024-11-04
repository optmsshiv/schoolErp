$(() => {
  // Function to fetch student data
  function fetchStudents() {
      $.ajax({
          url: '../php/fetch_active_student.php', // The PHP file that returns student data
          type: 'GET',
          dataType: 'json',
          success: function(data) {
              let tableBody = $('#student-table-body');
              tableBody.empty(); // Clear existing table data

              if (data.length > 0) {
                  let sr_no = 1; // Initialize serial number
                  $.each(data, function(index, student) {
                      tableBody.append(`<tr>
                                          <td><input type='checkbox'></td>
                                          <td>${sr_no++}</td>
                                          <td>${student.first_name}</td>
                                          <td>${student.father_name}</td>
                                          <td>${student.class_name}</td>
                                          <td>${student.roll_no}</td>
                                          <td>${student.phone}</td>
                                          
                                          <td>
                                              <button class='btn btn-primary btn-sm'>Edit</button>
                                              <button class='btn btn-danger btn-sm'>Delete</button>
                                          </td>
                                      </tr>`);
                  });
              } else {
                  tableBody.append("<tr><td colspan='9'>No records found</td></tr>");
              }
          },
          error: function(xhr, status, error) {
              console.error("Error fetching data: ", status, error);
          }
      });
  }

  // Fetch student data on page load
  fetchStudents();
});
