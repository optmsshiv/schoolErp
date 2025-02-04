{
    "messaging_product": "whatsapp",
    "to": "917282071620",  // Replace with the recipient's phone number
    "type": "template",
    "template": {
        "name": "due_amount",  // Template name
        "language": {
            "code": "en_US"
        },
        "components": [
            {
                "type": "body",
                "parameters": [
                    { "type": "text", "text": "John Doe" },  // {{1}}: Student's name
                    { "type": "text", "text": "$500" },      // {{2}}: Amount
                    { "type": "text", "text": "January Tuition Fee" },  // {{3}}: Fee type
                    { "type": "text", "text": "31st January 2025" },  // {{4}}: Due date
                    { "type": "text", "text": "UPI / QR Code" },  // {{5}}: Payment method
                    { "type": "text", "text": "+1 123-456-7890" },  // {{6}}: Contact number
                    { "type": "text", "text": "XYZ School" }   // {{7}}: School name
                ]
            },
            {
                "type": "button",
                "sub_type": "flow",
                "index": 0,
                "parameters": [
                    { "type": "text", "text": "Proceed with Payment" }  // Button label
                ]
            }
        ]
    }
}


// for postman
{
    "messaging_product": "whatsapp",
    "to": "917282071620",  // Replace with the recipient's phone number
    "type": "template",
    "template": {
        "name": "due_amount",  // Template name
        "language": {
            "code": "en_US"
        },
        "components": [
            {
                "type": "body",
                "parameters": [
                    { "type": "text", "text": "Sumati Yadav" },  // {{1}}: Student's name
                    { "type": "text", "text": "₹ 2500.00" },      // {{2}}: Amount
                    { "type": "text", "text": "January" },  // {{3}}: Fee type
                    { "type": "text", "text": "31st January 2025" },  // {{4}}: Due date
                    { "type": "text", "text": "UPI / QR Code" },  // {{5}}: Payment method
                    { "type": "text", "text": "7282071620" },  // {{6}}: Contact number
                    { "type": "text", "text": "XYZ School" }   // {{7}}: School name
                ]
            },
            {
                "type": "button",
                "sub_type": "flow",
                "index": 0,
                "parameters": [
                    { "type": "text", "text": "Proceed with Payment" }  // Button label
                ]
            }
        ]
    }
}



/* menu dropdown */
<a class="dropdown-item border-bottom" href="javascript:;" id="userSuspend" data-id="${
                         user.user_id
                       }">Suspend</a>

                       <a class="dropdown-item" href="javascript:;" id="userIdSms" data-id="${
                         user.user_id
                       }">Credential</a>



function refreshUserTable() {
    $.ajax({
      url: '../php/userRole/get_user_role.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        if (response && response.length > 0) {
          var tableBody = $('#userTable tbody');
          tableBody.empty();

          response.forEach(function (user) {
            var avatar = user.user_role_avatar ? user.user_role_avatar : '../assets/img/avatars/default-avatar.png';

            // Determine dropdown menu options based on user status
            var dropdownMenu = '';
            if (user.status === 'Pending') {
              dropdownMenu = `

                            <a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>
                        `;
            } else if (user.status === 'Active') {
              dropdownMenu = `
                            <a class="dropdown-item border-bottom" href="javascript:;" id="userEdit" data-id="${user.user_id}">Edit</a>
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
                <td>${user.joining_date}</td>
                <td><span class="badge ${user.status === 'Active' ? 'bg-label-success' : 'bg-label-warning'}">${
              user.status
            }</span></td>
                <td>
                  <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info" id="userView" data-id="${
                    user.user_id
                  }"></a>
                  <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" id="userDelete" data-id="${
                    user.user_id
                  }"></a>
                     <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm me-2 text-warning"
                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                     <div class="dropdown-menu dropdown-menu-end">
                       <a class="dropdown-item border-bottom" href="javascript:;" id="userEdit" data-id="${
                         user.user_id
                       }">Edit</a>
                       ${dropdownMenu}
                     </div>
                </td>
              </tr>
            `;
            tableBody.append(row);
          });

          var table = $('#userTable').DataTable();
          table.clear();
          table.rows.add($('#userTable tbody tr')).draw();
        } else {
          alert('No users found!');
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX error: ' + status + ': ' + error);
      }
    });
  }


  /* funciton to chagne status */

    function changeStatus(userId, newStatus) {
    $.ajax({
      url: '../php/userRole/update_user_status.php',
      type: 'POST',
      data: { user_id: userId, status: newStatus },
      success: function (response) {
        if (response.success) {
          alert(`User status changed to ${newStatus}`);

          // Find the row for the updated user
          var row = $(`#userTable tbody tr`).filter(function () {
            return $(this).find('td:eq(1)').text().trim() == userId;
          });

          if (row.length === 0) {
            console.error('Row not found for user ID:', userId);
            return;
          }

          // Update the status badge
          var statusBadge = row.find('td:eq(6) span');
          if (newStatus === 'Active') {
            statusBadge.removeClass('bg-label-danger bg-label-warning').addClass('bg-label-success').text(newStatus);
          } else if (newStatus === 'Suspended') {
            statusBadge.removeClass('bg-label-success bg-label-warning').addClass('bg-label-danger').text(newStatus);
          } else if (newStatus === 'Pending') {
            statusBadge.removeClass('bg-label-success bg-label-danger').addClass('bg-label-warning').text(newStatus);
          }

          // Update dropdown menu based on the new status
          var dropdownMenu = row.find('.dropdown-menu');
          dropdownMenu.empty(); // Clear existing options

          if (newStatus === 'Pending') {
            dropdownMenu.append(
              `<a class="dropdown-item border-bottom userActivate" href="javascript:;" data-id="${userId}">Activate</a>`
            );
          } else if (newStatus === 'Active') {
            dropdownMenu.append(`
                        <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${userId}">Suspend</a>
                        <a class="dropdown-item userCredential" href="javascript:;" data-id="${userId}">Send Credential</a>
                    `);
          } else if (newStatus === 'Suspended') {
            dropdownMenu.append(
              `<a class="dropdown-item border-bottom userActivate" href="javascript:;" data-id="${userId}">Activate</a>`
            );
          }
        } else {
          alert('Failed to change status!');
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX error: ' + status + ': ' + error);
      }
    });
  }

