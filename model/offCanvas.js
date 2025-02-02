// Declare variables for Bearer Token and Phone Number ID
const BEARER_TOKEN =
  'AAX3BfPtyaEBOZB9QyNV5igM8OHZCHTaZCCwjlGS88wju9zbBvJiqdwHd3ZBmqPgXvjTZBUh3JxHqGi2TDcZBPVR0Y5RmrTr8EahA23edcPycp2ZCeZBLLz8dBhGu5STmbQGa5B5zA6Rc3mAoSXimpdrAa8d7IiEjUjQRFWmwwgqfUWd2ITBBZAtUpKU2ZBtJmTFnZCCwZDZD'; // Replace with your actual Bearer Token
const PHONE_NUMBER_ID = '363449376861068'; // Replace with your actual Phone Number ID
// vanilla js (without JQuery)
document.addEventListener('DOMContentLoaded', function () {
  // Load off-canvas HTML dynamically
  fetch('../model/offCanvas.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load offCanvas.html');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('offcanvasAddUser').innerHTML = data;
      initializeOffCanvas(); // Initialize offcanvas after loading
    })
    .catch(error => {
      console.error('Error loading offCanvas.html:', error);
    });

  function initializeOffCanvas() {
    var offcanvasElement = document.getElementById('userAddCanvas');
    if (!offcanvasElement) {
      console.error('Off-canvas element not found');
      return;
    }

    offcanvasElement.addEventListener('shown.bs.offcanvas', function () {
      // console.log('Off-canvas shown');

      var form = document.getElementById('addNewUser');
      if (!form) {
        console.error('Form element not found');
        return;
      }

      // console.log('Form found, adding event listener');

      // Prevent duplicate event listeners
      form.removeEventListener('submit', handleFormSubmit);
      form.addEventListener('submit', handleFormSubmit);
    });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var submitButton = form.querySelector("button[type='submit']");

    // Disable the submit button to prevent multiple clicks
    if (submitButton) {
      submitButton.disabled = true;
    }

    // Show loading Swal immediately
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we add the user...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    var formData = new FormData(form);

    // Close the off-canvas immediately before sending the request
    var offcanvasInstance = bootstrap.Offcanvas.getInstance(document.getElementById('userAddCanvas'));
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }

    // Send the form data to the server
    fetch('../php/canvaData.php', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          // Hide loading Swal and show success message
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            toast: true,
            text: `New user created successfully with User ID: ${data.userId} and Password: ${data.password}`,
            confirmButtonText: 'OK'
          }).then(() => {
            form.reset(); // Reset the form
            refreshUserTable(); // Refresh the table to show new data

            // Send WhatsApp Message
            sendWhatsAppMessage(data.fullname, data.userId, data.password, data.phone);
          });
        } else {
          // Hide loading Swal and show error message
          Swal.fire({
            icon: 'error',
            position: 'top',
            toast: true,
            title: 'Oops...',
            text: data.message || 'Something went wrong. Please try again.',
            confirmButtonText: 'OK'
          });
        }

        // Re-enable submit button
        if (submitButton) {
          submitButton.disabled = false;
        }
      })
      .catch(error => {
        // Hide loading Swal and show error message
        Swal.fire({
          icon: 'error',
          position: 'top',
          toast: true,
          title: 'Oops...',
          text: 'Something went wrong. Please try again.',
          confirmButtonText: 'OK'
        });

        console.error('Fetch error:', error);

        // Re-enable submit button
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  }

  function sendWhatsAppMessage(fullname, userId, password, phone) {
    if (!phone) {
      console.error('Phone number is missing.');
      return;
    }

    var templateName = 'user_role'; // Replace with your actual template name
    var fromName = 'OPTMS Tech'; // Change this to your organization's name or dynamic value

    var messageData = {
      messaging_product: 'whatsapp',
      to: phone, // Automatically use the user's phone number
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: fullname },
              { type: 'text', text: userId },
              { type: 'text', text: password },
              { type: 'text', text: fromName }
            ]
          }
        ]
      }
    };

    fetch('https://graph.facebook.com/v21.0/363449376861068/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BEARER_TOKEN}`
      },
      body: JSON.stringify(messageData)
    })
      .then(response => response.json())
      .then(data => console.log('WhatsApp Message Sent:', data))
      .catch(error => console.error('WhatsApp API Error:', error));
  }

  // Function to refresh the user table
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
                <td><span class="badge ${user.status === 'Active' ? 'bg-label-success' : 'bg-label-danger'}">${
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
                       <a class="dropdown-item border-bottom" href="javascript:;" id="userSuspend" data-id="${
                         user.user_id
                       }">Suspend</a>
                       <a class="dropdown-item" href="javascript:;" id="userIdSms" data-id="${
                         user.user_id
                       }">Credential</a>
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

                refreshUserTable();
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

});

function validateMobileNumber(input) {
  // Remove non-numeric characters
  input.value = input.value.replace(/\D/g, '');

  // Show error message if input is incomplete
  const errorMsg = document.getElementById('phoneError');
  if (input.value.length !== 10) {
    errorMsg.style.display = 'block';
  } else {
    errorMsg.style.display = 'none';
  }
}


