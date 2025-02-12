// Declare variables for Bearer Token and Phone Number ID
const BEARER_TOKEN = '565986464565'; // Replace with your actual Bearer Token

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
            text: `New user created successfully with User ID: ${data.user_id} and Password: ${data.password}`,
            confirmButtonText: 'OK'
          }).then(() => {
            form.reset(); // Reset the form

            // Add only the new user to the table
            addNewUserToTable(data);

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

    // Fetch credentials from backend
    fetch('/php/whatsapp/get_whatsapp_credentials.php')
      .then(response => response.json())
      .then(credentials => {
        if (!credentials.success) {
          console.error('Error fetching WhatsApp credentials:', credentials.message);
          return;
        }

        const accessToken = credentials.access_token;
        const phoneNumberId = credentials.phone_number_id;

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

        fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(messageData)
        })
          .then(response => response.json())
          .then(data => console.log('WhatsApp Message Sent:', data))
          .catch(error => console.error('WhatsApp API Error:', error));
      })
      .catch(error => console.error('Error fetching WhatsApp credentials:', error));
  }

  // Function to format date
  function formatDate(dateString) {
    if (!dateString) return 'N/A'; // Handle empty dates
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  // Function to refresh the user table
  function addNewUserToTable(user) {
    var tableBody = $('#userTable tbody');
    var avatar = user.user_role_avatar ? user.user_role_avatar : '../assets/img/avatars/default-avatar.png';

    // Determine dropdown menu options based on user status
    var dropdownMenu = '';
    if (user.status === 'Pending') {
      dropdownMenu = `
                            <a class="dropdown-item border-bottom" href="javascript:;" id="userEdit" data-id="${user.user_id}">Edit</a>
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
                <td><span class="badge ${user.status === 'Active' ? 'bg-label-success' : 'bg-label-warning'}">${user.status
      }</span></td>
                <td>
                  <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info" id="userView" data-id="${user.user_id
      }"></a>
                  <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" id="userDelete" data-id="${user.user_id
      }"></a>
                     <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm me-2 text-warning"
                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                     <div class="dropdown-menu dropdown-menu-end">
                       ${dropdownMenu}
                     </div>
                </td>
              </tr>
            `;

    // Append new user to the table
    tableBody.append(row);

    // Reinitialize DataTable to include the new row
    $('#userTable').DataTable().row.add($(row)).draw();
  }


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


