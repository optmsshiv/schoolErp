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
            <tr data-id="${user.user_id}">
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
              <td><span class="badge ${
                user.status === 'Active'
                  ? 'bg-label-success'
                  : user.status === 'Suspended'
                  ? 'bg-label-secondary'
                  : 'bg-label-warning'
              }">${user.status}</span></td>
              <td>
                <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info" id="userView" data-id="${
                  user.user_id
                }" title="View User"></a>
                <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" id="userDelete" data-id="${
                  user.user_id
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

 $(document).on('change', '#avatarUpload', function (event) {
   var input = event.target;
   var file = input.files[0];

   if (file) {
     var fileType = file.type;
     var validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

     if (!validImageTypes.includes(fileType)) {
       Swal.fire({
         icon: 'error',
         title: 'Invalid File',
         text: 'Please select a valid image (JPEG, jpg, PNG, GIF, WEBP).'
       });
       input.value = ''; // Reset input
       return;
     }

     // File size limit (2MB)
    //if (file.size > 2 * 1024 * 1024) {
    //  Swal.fire({
    //    icon: 'warning',
    //    title: 'File too large',
    //    text: 'Maximum allowed size is 2MB.'
    //  });
    //  input.value = ''; // Reset input
    //  return;
    //}

     var reader = new FileReader();
     reader.onload = function (e) {
       $('#userAvatar').attr('src', e.target.result);
     };

     reader.readAsDataURL(file);
   }
 });

  // Handle 'Edit' button click event
  $(document).on('click', '.userEdit', function () {
    var userId = $(this).data('id');

    $('#userAvatar').attr('src', '/assets/img/avatars/default-avatar.png');

    // Show user ID in console for debugging
    console.log('Edit User ID:', userId);
    // Load the modal content dynamically
    $.ajax({
      url: '/html/model_user_edit/user_edit.html', // Adjust path based on your folder structure
      type: 'GET',
      success: function (data) {
        // Append the modal to the body (if not already present)
        if ($('#editUserModal').length === 0) {
          $('body').append(data);
        }

        // Set user ID in modal
        $('#editUserModal').find('#userIdInput').val(userId);

        // Show loading text inside the modal
      //  $('#editUserModal .modal-body').html('<p>Loading user details...</p>');

        // Show the modal
        $('#editUserModal').modal('show');

        // Load user details using AJAX
        $.ajax({
          url: '../php/userRole/get_user_details.php', // Ensure correct path
          type: 'POST',
          data: { user_id: userId },
          dataType: 'json',
          success: function (response) {
            if (response.success) {
              var user = response.data;
              console.log('User Data:', user); // Check if data exists

              // Populate the form with user data
              $('#userIdInput').val(user.user_id);
              $('#qualificationInput').val(user.qualification);
              $('#fullNameInput').val(user.fullname);
              $('#roleSelect').val(user.role);
              $('#emailInput').val(user.email);
              $('#phoneInput').val(user.phone);
              $('#joiningDateInput').val(user.joining_date);
              $('#statusSelect').val(user.status);
              $('#statusCauseInput').val(user.status_change_cause);
              $('#changeByInput').val(user.change_by);
              $('#salaryInput').val(user.salary);
              $('#aadharInput').val(user.aadhar_card);
              $('#subjectInput').val(user.subject);
              $('#userAddress').val(user.user_address);
              $('#genderSelect').val(user.gender);
              $('#dobDateInput').val(user.dob);
              $('#bankNameInput').val(user.bank_name);
              $('#branchNameInput').val(user.branch_name);
              $('#accountNumberInput').val(user.account_number);
              $('#ifscCodeInput').val(user.ifsc_code);
              $('#accountType').val(user.account_type);

              // Update user avatar
              $('#userAvatar').attr('src', user.user_role_avatar || '/assets/img/avatars/default-avatar.png');
            } else {
              $('#editUserModal .modal-body').html('<p class="text-danger">User not found.</p>');
            }
          },
          error: function () {
            $('#editUserModal .modal-body').html('<p class="text-danger">Error fetching data. Please try again.</p>');
          }
        });
      },
      error: function () {
        alert('Failed to load the edit modal.');
      }
    });
  });

  // Save user role update

 $(document).on('click', '#saveUserChanges', function () {
   var $this = $(this);
   $this.prop('disabled', true).text('Saving...'); // Disable button and change text to prevent multiple clicks

   var userId = $('#userIdInput').val();
   var fullName = $('#fullNameInput').val();
   var qualification = $('#qualificationInput').val();
   var role = $('#roleSelect').val();
   var email = $('#emailInput').val();
   var phone = $('#phoneInput').val();
   var dob = $('#dobDateInput').val();
   var joiningDate = $('#joiningDateInput').val();
   var status = $('#statusSelect').val();
   var gender = $('#genderSelect').val();
   var salary = $('#salaryInput').val();
   var aadhar = $('#aadharInput').val();
   var subject = $('#subjectInput').val();
   var address = $('#userAddress').val();
   var bankName = $('#bankNameInput').val();
   var branchName = $('#branchNameInput').val();
   var accountNumber = $('#accountNumberInput').val();
   var ifscCode = $('#ifscCodeInput').val();
   var accountType = $('#accountType').val();

   // Creating data object to send
   var formData = {
     user_id: userId,
     full_name: fullName,
     qualification: qualification,
     role: role,
     email: email,
     phone: phone,
     dob: dob,
     joining_date: joiningDate,
     status: status,
     gender: gender,
     salary: salary,
     aadhar: aadhar,
     subject: subject,
     user_address: address,
     bank_name: bankName,
     branch_name: branchName,
     account_number: accountNumber,
     ifsc_code: ifscCode,
     account_type: accountType
   };

   // AJAX request to save data
   $.ajax({
     url: '/php/userRole/update_user_details.php', // Ensure the correct PHP path
     type: 'POST',
     data: formData,
     dataType: 'json',
     success: function (response) {
       if (response.success) {
         alert('User details updated successfully!');
         $('#editUserModal').modal('hide'); // Close modal

         // Find the row corresponding to the user to use this remove Using data-id on <tr> from table
         /*
         var userRow = $(`#userTable tbody tr`).filter(function () {
           return $(this).find('td:eq(1)').text().trim() == userId;
         });*/

         /*$('tr[data-id="userId"]') is a direct selection and faster than filtering through all rows.
         The first method (filter(function() { return $(this).find('td:eq(1)').text() == userId; }))
          requires checking each row manually, making it slower.
          */

         // Find the row corresponding to the user
         var userRow = $('#userTable tbody').find('tr[data-id="' + userId + '"]');

         if (userRow.length > 0) {
           // Update the table row data dynamically
           userRow.find('td:nth-child(3) h6').text(fullName);
           userRow.find('td:nth-child(4)').text(role);
           userRow.find('td:nth-child(5)').text(phone);
           userRow.find('td:nth-child(6)').text(joiningDate);

           // Apply green highlight
           userRow.addClass('highlight-success');

           // Remove highlight after 3 seconds
           setTimeout(function () {
             userRow.addClass('fade-out');
             setTimeout(function () {
               userRow.removeClass('highlight-success fade-out'); // Remove both classes
             }, 1000); // Wait for fade-out animation before fully removing highlight
           }, 3000);
         } else {
           console.warn('Row for user ID ' + userId + ' not found!');
         }
       } else {
         alert('Failed to update user: ' + response.message);
       }
     },
     error: function () {
       alert('Error updating user. Please try again.');
     },
     complete: function () {
       $this.prop('disabled', false).text('Save Changes'); // Re-enable button
     }
   });
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

          // Find the row for the updated user
          /*
          var row = $(`#userTable tbody tr`).filter(function () {
            return $(this).find('td:eq(1)').text().trim() == userId;
          });*/
          var row = $('#userTable').find('tr[data-id="' + userId + '"]');

          if (row.length === 0) {
            console.error('Row not found for user ID:', userId);
            return;
          }

          // Apply highlight class and ensure it sticks
          row.addClass('highlight');

          setTimeout(() => {
            row.removeClass('highlight');
          }, 5000); // Keep highlighted for 5 seconds

          // Update the status badge
          var statusBadge = row.find('td:eq(6) span');
          statusBadge.removeClass('bg-label-success bg-label-secondary bg-label-warning');

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
    alert('Send credentials for User ID:' + userId);
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

