$(document).ready(function () {
  // Initialize DataTable
  var table = $('#userTable').DataTable({
    dom: '<"row"<"col-md-6"l><"col-md-6"B>>' + 't' + '<"row"<"col-md-6"i><"col-md-6"p>>',

    lengthMenu: [
      [5, 10, 15, 25, 50, -1],
      [5, 10, 15, 25, 50, 'All']
    ],
    pagingType: 'full_numbers',
    responsive: true,
    ordering: false, // Disable sorting for all columns
    pageLength: 5,
    language: {
      paginate: {
        first: '<<',
        last: '>>',
        next: '>',
        previous: '<'
      },
      lengthMenu: 'Display _MENU_ records per page',
      info: 'Showing _START_ to _END_ of _TOTAL_ entries',
      zeroRecords: 'No matching records found',
      infoEmpty: 'No entries to display',
      infoFiltered: '(filtered from _MAX_ total entries)'
    },

    infoCallback: function (settings, start, end, max, total, pre) {
      // Custom info text with further tweaks
      let displayLength = settings._iDisplayLength === -1 ? total : settings._iDisplayLength;
      return `Showing ${start} to ${end} of ${total} entries (Selected ${displayLength} records per page)`;
    },
    drawCallback: function () {
      // Add custom actions when the table is redrawn
      // console.log('Table redrawn with current settings');
    }
  });

  // Function to format date
  function formatDate(dateString) {
    if (!dateString) return 'N/A'; // Handle empty dates
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Fetch user data using AJAX
  $.ajax({
    url: '../php/userRole/get_user_role.php', // The PHP file where user data is fetched
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      // Check if data exists
      if (response && response.length > 0) {
        var tableBody = $('#userTable tbody');
        tableBody.empty(); // Clear any existing rows

        // Loop through each user and append rows to the table
        response.forEach(function (user) {
          // Default avatar if not available
          var avatar = user.user_role_avatar ? user.user_role_avatar : '../assets/img/avatars/default-avatar.png';

          // Determine dropdown menu options based on user status
          var dropdownMenu = '';
          if (user.status === 'Pending') {
            dropdownMenu = `
                            <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${user.user_id}">Edit</a>
                            <a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>
                        `;
          } else if (user.status === 'Active') {
            dropdownMenu = `
                            <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${user.user_id}">Edit</a>
                            <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${user.user_id}">Suspend</a>
                            <a class="dropdown-item userCredential" href="javascript:;" data-id="${user.user_id}">Send Credential</a>
                        `;
          } else if (user.status === 'Suspended') {
            dropdownMenu = `
                            <a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>
                        `;
          }

          var row = `
            <tr>
              <td><input type="checkbox" class="row-select"></td>
              <td>${user.user_id}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar avatar-sm">
                    <img src="${avatar}" alt="avatar" class="rounded-circle" />
                  </div>
                  <div class="ms-2">
                    <h6 class="mb-0 ms-2">${user.fullname}</h6>
                  </div>
                </div>
              </td>
              <td>${user.role}</td>
              <td>${user.phone}</td>
              <td>${formatDate(user.joining_date)}</td> <!-- ✅ Formatted Date -->
              <td><span class="badge ${user.status === 'Active'
              ? 'bg-label-success'
              : user.status === 'Suspended'
                ? 'bg-label-secondary'
                : 'bg-label-warning'
            }">${user.status}</span></td>
              <td>
                <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info" id="userView" data-id="${user.user_id
            }" title="View User"></a>
                <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" id="userDelete" data-id="${user.user_id
            }" title="Delete User"></a>
                <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm me-2 text-warning" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                <div class="dropdown-menu dropdown-menu-end">
                  ${dropdownMenu}
                </div>
              </td>
            </tr>
          `;
          tableBody.append(row); // Add the new row to the table
        });

        // Reinitialize DataTable after adding rows dynamically
        table.rows.add($('#userTable tbody tr')).draw();
      } else {
        alert('No users found!');
      }
    },
    error: function (xhr, status, error) {
      console.error('AJAX error: ' + status + ': ' + error);
    }
  });

  // Handle 'Select All' checkbox behavior
  $('#select-all').on('click', function () {
    var rows = table.rows({ search: 'applied' }).nodes();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);
  });

  // Handle individual row checkbox behavior
  $('#userTable tbody').on('change', 'input[type="checkbox"]', function () {
    var rowCount = $('input[type="checkbox"]:checked').length; // Get number of selected checkboxes
    var totalRows = table.rows({ search: 'applied' }).nodes().length; // Total number of rows after search

    var selectAll = $('#select-all').get(0);
    if (rowCount === totalRows) {
      selectAll.checked = true;
      selectAll.indeterminate = false;
    } else if (rowCount === 0) {
      selectAll.checked = false;
      selectAll.indeterminate = false;
    } else {
      selectAll.indeterminate = true;
    }
  });

  // Event handler for custom length dropdown
  $('#customLength').on('change', function () {
    var length = $(this).val();
    table.page.len(length).draw();
  });

  // Handle 'View' button click event
  $('#userTable').on('click', '#userView', function () {
    var userId = $(this).data('id');
    alert('View details for User ID: ' + userId);
    // Redirect to user view page or load modal with user data
  });

  // Handle 'Edit' button click event
  $('#userTable').on('click', '#userEdit', function () {
    var userId = $(this).data('id');
    alert('Edit User ID: ' + userId);
    // Open edit modal or redirect to edit page
  });


  // Handling Status Change (Activate, Suspend)
  $(document).on('click', '.userActivate', function () {
    var userId = $(this).data('id');
    if (confirm('Are you sure you want to activate this user?')) {
      changeStatus(userId, 'Active');
    }
  });

  $(document).on('click', '.userSuspend', function () {
    var userId = $(this).data('id');
    if (confirm('Are you sure you want to suspend this user?')) {
      changeStatus(userId, 'Suspended');
    }
  });

  function showLoadingSpinner() {
    $('body').append('<div class="loading-spinner">Loading...</div>');
  }

  function hideLoadingSpinner() {
    $('.loading-spinner').remove();
  }

  function changeStatus(userId, newStatus) {
    showLoadingSpinner();
    $.ajax({
      url: '../php/userRole/update_user_status.php',
      type: 'POST',
      data: { user_id: userId, status: newStatus },
      dataType: 'json', // Ensure response is parsed as JSON
      success: function (response) {
        hideLoadingSpinner();
        console.log('Server Response:', response); // Debugging line

        if (response && response.success) {
          // Ensure response.success exists
          Swal.fire({
            icon: 'success',
            title: `User status changed to ${newStatus}`,
            toast: true,
            timer: 2000
          });
          /*
          // Highlight the row in the table
          $(`#userTable tbody tr[data-id="${userId}"]`).addClass('highlight');
          setTimeout(() => {
            $(`#userTable tbody tr[data-id="${userId}"]`).removeClass('highlight');
          }, 5000); // Highlight for 5 seconds*/

          // Find the row for the updated user
          var row = $(`#userTable tbody tr`).filter(function () {
            return $(this).find('td:eq(1)').text().trim() == userId;
          });

          if (row.length === 0) {
            console.error('Row not found for user ID:', userId);
            return;
          }

          $(`#userTable tbody tr[data-id="${userId}"]`).addClass('highlight');
          setTimeout(() => {
            $(`#userTable tbody tr[data-id="${userId}"]`).removeClass('highlight');
          }, 5000); // Highlight for 5 seconds

          
          // Update the status badge
          var statusBadge = row.find('td:eq(6) span');
          statusBadge.removeClass('bg-label-success bg-label-danger bg-label-warning');

          if (newStatus === 'Active') {
            statusBadge.addClass('bg-label-success').text(newStatus);
          } else if (newStatus === 'Suspended') {
            statusBadge.addClass('bg-label-secondary').text(newStatus);
          } else if (newStatus === 'Pending') {
            statusBadge.addClass('bg-label-warning').text(newStatus);
          }

          // Update dropdown menu based on the new status
          var dropdownMenu = row.find('.dropdown-menu');
          dropdownMenu.empty(); // Clear existing options

          if (newStatus === 'Pending') {
            dropdownMenu.append(
              `
                <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${userId}">Edit</a>
                <a class="dropdown-item userActivate" href="javascript:;" data-id="${userId}">Activate</a>`
            );
          } else if (newStatus === 'Active') {
            dropdownMenu.append(`
                        <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${userId}">Edit</a>
                        <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${userId}">Suspend</a>
                        <a class="dropdown-item userCredential" href="javascript:;" data-id="${userId}">Send Credential</a>
                    `);
          } else if (newStatus === 'Suspended') {
            dropdownMenu.append(
              `<a class="dropdown-item userActivate" href="javascript:;" data-id="${userId}">Activate</a>`
            );
          }
        } else {
          console.error('Response format incorrect or success=false:', response);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to change status!',
            confirmButtonText: 'OK'
          });
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX error:', xhr.responseText);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Handle 'Credential send' button click event
  $(document).on('click', '.userCredential', function () {
    var userId = $(this).data('id');
    alert('Send credentials for User ID: ${userId}');
    // Implement credential sending functionality (e.g., AJAX request to send credentials)
  });

  // Handle Delete function
  /*
    $(document).on('click', '#userDelete', function () {
      var userId = $(this).data('id'); // Get the user ID from data attribute
      var row = $(this).closest('tr'); // Get the table row containing the delete button

      if (confirm('Are you sure you want to delete this user: ' + userId + '?')) {
        $.ajax({
          url: '../php/userRole/delete_user.php', // PHP file to handle deletion
          type: 'POST',
          data: { user_id: userId },
          dataType: 'json',
          success: function (response) {
            if (response.success) {
              alert('User deleted successfully!');
              var table = $('#userTable').DataTable();
              table.row(row).remove().draw(); // Remove row from DataTable
              // refreshUserTable(); // Refresh the table after deletion
            } else {
              alert('Error: ' + response.message);
            }
          },
          error: function (xhr, status, error) {
            console.error('AJAX Error: ' + status + ': ' + error);
          }
        });
      }
    });
  */

  $(document).on('click', '#userDelete', function () {
    var userId = $(this).data('id'); // Get the user ID
    var row = $(this).closest('tr'); // Get the table row containing the delete button

    // Show confirmation popup using SweetAlert2
    Swal.fire({
      title: 'You will not be able to revert this! ',
      text: 'Are you sure want to delete the user :  ' + userId + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        // Show Swal loading while processing
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait',
          icon: 'info',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        $.ajax({
          url: '../php/userRole/delete_user.php', // PHP script to handle deletion
          type: 'POST',
          data: { user_id: userId },
          dataType: 'json',
          success: function (response) {
            if (response.success) {
              // Show success message
              Swal.fire({
                title: 'Deleted!',
                text: 'User ' + userId + ' has been deleted.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });

              // Remove the row dynamically from DataTable
              var table = $('#userTable').DataTable();
              table.row(row).remove().draw();
            } else {
              Swal.fire('Error!', response.message, 'error');
            }
          },
          error: function (xhr, status, error) {
            console.error('AJAX Error:', status, error);
            Swal.fire('Error!', 'An error occurred while deleting.', 'error');
          }
        });
      }
    });
  });

  // Handle print button click event
  $('#printBtn').on('click', function () {
    table.button('.buttons-print').trigger(); // Trigger print when clicked
  });

  // Ensure the print button is only visible if the print button is configured
  if ($('.buttons-print').length) {
    $('#printBtn').show(); // Show the print button if it's available
  } else {
    $('#printBtn').hide(); // Hide the print button if not available
  }

  //search box
  $('#searchBox').on('keyup', function () {
    table.search(this.value).draw();
  });
});

