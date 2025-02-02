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
      console.log('Table redrawn with current settings');
    }
  });

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
              <td>${user.joining_date}</td>
              <td><span class="badge ${user.status === 'Active'
              ? 'bg-label-success'
              : user.status === 'Suspended'
                ? 'bg-label-secondary'
                : 'bg-label-danger'
            }">${user.status}</span></td>
              <td>
                <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info" id="userView" data-id="${user.user_id
            }" title="View User"></a>
                <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" id="userDelete" data-id="${user.user_id
            }" title="Delete User"></a>
                <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm me-2 text-warning" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item border-bottom" href="javascript:;" id="userEdit" data-id="${user.user_id
            }" title="Edit User">Edit</a>
                  <a class="dropdown-item" href="javascript:;" id="userSuspend" data-id="${user.user_id
            }" title="Suspend User">Suspend</a>
                  <a class="dropdown-item" href="javascript:;" id="userIdSms" data-id="${user.user_id}">Credential</a>
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

  // Handle 'Suspend' button click event
  $('#userTable').on('click', '#userSuspend', function () {
    var userId = $(this).data('id');
    alert('Suspend User ID: ' + userId);
    // Implement user suspension functionality (e.g., AJAX request to suspend user)
  });


  // Handle 'Delete' button click event
  $('#userTable').on('click', '#userDelete', function () {
    var userId = $(this).data('id');
    var row = $(this).closest('tr'); // Get the closest row (tr) to the delete button

    // Optional: Ask for confirmation before deleting
    swal({
      title: 'Are you sure?',
      text: 'You are about to delete User ID: ' + userId,
      text: "You won't be able to undo this!",
      icon: 'warning',
      confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        // Send AJAX request to delete user
        $.ajax({
          url: '../php/userRole/delete_user.php', // PHP file to handle user deletion
          type: 'POST',
          data: { user_id: userId },
          success: function (response) {
            if (response.success) {
              swal('Deleted!', 'User deleted successfully', 'success');
              table.row(row).remove().draw(); // Remove row from DataTable
            } else {
              swal('Failed!', 'Failed to delete user', 'error');
            }
          },
          error: function (xhr, status, error) {
            console.error('AJAX error: ' + status + ': ' + error);
            swal('Error!', 'Something went wrong, please try again later.', 'error');
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


/*
// delete user
  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('bx-trash')) {
      let row = event.target.closest('tr'); // Get the closest row
      let userId = event.target.getAttribute('data-id'); // Get user ID

      Swal.fire({
        title: 'Are you sure want to delete ID ' + userId + '?',
        text: "You won't be able to undo this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.isConfirmed) {
          fetch('../php/userRole/delete_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'user_id=' + encodeURIComponent(userId)
          })
            .then(response => response.text())
            .then(response => {
              if (response === 'success') {
                row.remove(); // Remove row from table
                Swal.fire('Deleted!', 'The user has been deleted.', 'success');
              } else {
                Swal.fire('Error!', 'Failed to delete the user.', 'error');
              }
            })
            .catch(() => {
              Swal.fire('Error!', 'Server error occurred.', 'error');
            });
        }
      });
    }
  });
*/
