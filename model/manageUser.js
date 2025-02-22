
// import { addNewUserToTable } from '../model/offCanvas.js';
$(function () {
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
    pageLength: 10,
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
    if (!dateString || dateString === '0000-00-00') return 'N/A'; // Handle empty and invalid dates
    let date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A'; // Ensure the date is valid
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Fetch user data using AJAX
$.ajax({
  url: '../php/userRole/get_user_role.php',
  type: 'GET',
  dataType: 'json',
  success: function (response) {
    let table = $('#userTable').DataTable();
    table.clear().draw();
    response.forEach(user => window.addNewUserToTable(user));
  },
  error: function (xhr, status, error) {
    console.error('AJAX error:', status, error);
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
    // console.log('Edit User ID:', userId);
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
              //  console.log('User Data:', user); // Check if data exists

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
    if ($this.prop('disabled')) return; // Prevent multiple clicks

    $this
      .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...')
      .prop('disabled', true);

    // Collect form data
    var formData = new FormData();
    var userId = $('#userIdInput').val().trim();
    var fullName = $('#fullNameInput').val().trim();
    var role = $('#roleSelect').val();
    var phone = $('#phoneInput').val().trim();
    var joiningDate = formatDate($('#joiningDateInput').val());

    formData.append('user_id', userId);
    formData.append('full_name', $('#fullNameInput').val());
    formData.append('qualification', $('#qualificationInput').val().trim());
    formData.append('role', $('#roleSelect').val());
    formData.append('email', $('#emailInput').val());
    formData.append('phone', $('#phoneInput').val());
    formData.append('dob', $('#dobDateInput').val());
    formData.append('joining_date', $('#joiningDateInput').val());
    formData.append('status', $('#statusSelect').val());
    formData.append('gender', $('#genderSelect').val());
    formData.append('salary', $('#salaryInput').val().trim());
    formData.append('aadhar', $('#aadharInput').val().trim());
    formData.append('subject', $('#subjectInput').val().trim());
    formData.append('user_address', $('#userAddress').val().trim());
    formData.append('bank_name', $('#bankNameInput').val().trim());
    formData.append('branch_name', $('#branchNameInput').val().trim());
    formData.append('account_number', $('#accountNumberInput').val().trim());
    formData.append('ifsc_code', $('#ifscCodeInput').val().trim());
    formData.append('account_type', $('#accountType').val());

    // Handle avatar upload
    var avatarFile = $('#avatarUpload')[0].files[0];
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    // Show progress bar
    $('#uploadProgressContainer').show();
    $('#uploadProgressBar').css('width', '0%').text('0%');

    // console.log([...formData.entries()]); // Check what's inside the formData

    // AJAX request to save data
    $.ajax({
      url: '/php/userRole/update_user_details.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false, // Required for file upload
      contentType: false, // Required for file upload

      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          'progress',
          function (e) {
            if (e.lengthComputable) {
              var percentComplete = Math.round((e.loaded / e.total) * 100);
              $('#uploadProgressBar')
                .css('width', percentComplete + '%')
                .text(percentComplete + '%');
            }
          },
          false
        );
        return xhr;
      },

      success: function (response) {
        if (response.success) {
          alert('User details updated successfully!');

          // Update the user avatar preview in the modal
          if (response.avatar_path && avatarFile) {
            $('#userAvatar').attr('src', response.avatar_path);
          }

          // Close the modal
          $('#editUserModal').modal('hide');

          // Find the row corresponding to the user
          var userRow = $('#userTable tbody').find('tr[data-id="' + userId + '"]');

          if (userRow.length > 0) {
            userRow.find('td:nth-child(3) h6').text(fullName);
            userRow.find('td:nth-child(4)').text(role);
            userRow.find('td:nth-child(5)').text(phone);
            userRow.find('td:nth-child(6)').text(joiningDate);

            // Update avatar if changed
            if (response.avatar_path) {
              userRow.find('td:nth-child(3) img').attr('src', response.avatar_path);
            }

            // Apply smooth highlight effect
            userRow.addClass('highlight-success');

            setTimeout(function () {
              userRow.addClass('fade-out');
              setTimeout(function () {
                userRow.removeClass('highlight-success fade-out');
              }, 1000);
            }, 3000);
          } else {
            console.warn('Row for user ID ' + userId + ' not found!');
          }
        } else {
          alert('Failed to update user: ' + (response.error || 'Unknown error'));
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX Error:', status, error);
        alert('Error updating user. Please try again.');
      },
      complete: function () {
        $this.prop('disabled', false).text('Save Changes');
        $('#uploadProgressContainer').hide(); // Hide progress bar after upload
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

  /*
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

          //var row = $(`#userTable tbody tr`).filter(function () {
          //  return $(this).find('td:eq(1)').text().trim() == userId;
          //});
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
  } */

  function changeStatus(userId, newStatus) {
    showLoadingSpinner();

    $.ajax({
      url: '../php/userRole/update_user_status.php',
      type: 'POST',
      data: { user_id: userId, status: newStatus },
      dataType: 'json',
      success: function (response) {
        hideLoadingSpinner();

        if (response && response.success) {
          Swal.fire({
            icon: 'success',
            title: `User status changed to ${newStatus}`,
            toast: true,
            timer: 2000
          });

          let table = $('#userTable').DataTable();

          // 🔥 Get the latest row from DOM instead of DataTable cache
          let rowNode = $(`#userTable tbody tr:has(td:contains(${userId}))`);

          if (rowNode.length === 0) {
            console.error('Row not found for user ID:', userId);
            return;
          }

          // 🔥 Extract fresh row data from the DOM
          let rowIndex = table.row(rowNode).index();
          let rowData = table.row(rowIndex).data();

          // ✅ Preserve the avatar & name (Assuming it's stored in column index 2)
          let currentAvatar = rowNode.find('td:eq(2)').html();

          // ✅ Update status badge dynamically
          let statusBadge = `<span class="status-badge badge ${
            newStatus === 'Active'
              ? 'bg-label-success'
              : newStatus === 'Suspended'
              ? 'bg-label-secondary'
              : 'bg-label-warning'
          }">${newStatus}</span>`;

          rowData[6] = statusBadge; // Assuming status column is at index 6
          rowData[2] = currentAvatar; // Keep avatar & name

          // ✅ Update dropdown menu options based on status
          let dropdownMenu = '';
          if (newStatus === 'Pending') {
            dropdownMenu = `
                        <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${userId}">Edit</a>
                        <a class="dropdown-item userActivate" href="javascript:;" data-id="${userId}">Activate</a>`;
          } else if (newStatus === 'Active') {
            dropdownMenu = `
                        <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${userId}">Edit</a>
                        <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${userId}">Suspend</a>
                        <a class="dropdown-item userCredential" href="javascript:;" data-id="${userId}">Send Credential</a>`;
          } else if (newStatus === 'Suspended') {
            dropdownMenu = `<a class="dropdown-item userActivate" href="javascript:;" data-id="${userId}">Activate</a>`;
          }

          // ✅ Update action buttons
          rowData[7] = `
                    <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info userView"
                       data-id="${userId}" title="View User"></a>
                    <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger userDelete"
                       data-id="${userId}" title="Delete User"></a>
                    <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm text-warning"
                       data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                      <div class="dropdown-menu dropdown-menu-end">${dropdownMenu}</div>
                `;

          // ✅ Force update in DataTable & refresh DOM
          table.row(rowIndex).data(rowData).invalidate().draw(false);

          // ✅ Fix Bootstrap dropdown issue
          setTimeout(() => {
            $('[data-bs-toggle="dropdown"]').dropdown();
          }, 100);

          // ✅ Highlight row temporarily
          $(rowNode).addClass('highlighted-row');
          setTimeout(() => $(rowNode).removeClass('highlighted-row'), 5000);
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
      error: function (xhr) {
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

  // Handel 'ViewButton' click event
  $(document).on('click', '.userView', function () {
    var userId = $(this).data('id');
    alert('View user profile:' + userId);
  });

  // Handle 'Credential send' button click event
  $(document).on('click', '.userCredential', function () {
    var userId = $(this).data('id');

    // AJAX request to fetch user credentials from the server
    $.ajax({
      url: '/php/whatsapp/getUserCredentials.php', // Backend script to fetch credentials
      type: 'POST',
      data: { user_id: userId }, // Send the user ID to the backend
      dataType: 'json', // Expect JSON response
      success: function (response) {
        if (response.success) {
          var fullName = response.data.fullname;
          var password = response.data.password;
          var phone = response.data.phone;
          var fromName = response.data.fromName;

          // Display confirmation before sending credentials
          if (confirm('Send credentials to:\n' + 'Full Name: ' + fullName + '\n' + 'Phone: ' + phone)) {
            // Send credentials via WhatsApp API
            $.ajax({
              url: '/php/whatsapp/sendUserRoleCred.php', // Script to send via WhatsApp
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({
                fullName: fullName,
                user_id: userId,
                password: password,
                phone: phone,
                fromName: fromName
              }),
              success: function (sendResponse) {
                console.log('Success:', sendResponse);
                alert('Credentials sent successfully!');
              },
              error: function (xhr) {
                console.error('Error:', xhr.responseText);
                alert('Failed to send credentials.');
              }
            });
          }
        } else {
          alert('User credentials not found.');
        }
      },
      error: function (xhr) {
        console.error('Error fetching credentials:', xhr.responseText);
        alert('Error retrieving user credentials.');
      }
    });
  });

  // Handle bulk action for changing status will use later
  /*
  $('#applyBulkAction').click(function () {
    var action = $('#bulkAction').val();
    var selectedUsers = [];
    $('.row-select:checked').each(function () {
      selectedUsers.push($(this).data('id'));
    });

    if (selectedUsers.length > 0 && action) {
      selectedUsers.forEach(function (userId) {
        changeStatus(userId, action);
      });
    } else {
      alert('Please select users and an action');
    }
  });  */

  // Handle Delete function
  $(document).on('click', '.userDelete', function () {
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
