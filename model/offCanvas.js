document.addEventListener('DOMContentLoaded', function () {
  // Load off-canvas HTML dynamically
  fetch('../model/offCanvas.html')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load offCanvas.html');
      return response.text();
    })
    .then(data => {
      document.getElementById('offcanvasAddUser').innerHTML = data;
      initializeOffCanvas();
    })
    .catch(error => console.error('Error loading offCanvas.html:', error));

  function initializeOffCanvas() {
    let offcanvasElement = document.getElementById('userAddCanvas');
    if (!offcanvasElement) {
      console.error('Off-canvas element not found');
      return;
    }

    offcanvasElement.addEventListener('shown.bs.offcanvas', function () {
      let form = document.getElementById('addNewUser');
      if (!form) {
        console.error('Form element not found');
        return;
      }

      // Prevent duplicate event listeners
      form.removeEventListener('submit', handleFormSubmit);
      form.addEventListener('submit', handleFormSubmit);
    });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    let submitButton = form.querySelector("button[type='submit']");

    // Disable submit button to prevent multiple clicks
    if (submitButton) submitButton.disabled = true;

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we add the user...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    let formData = new FormData(form);

    // Close the off-canvas before sending the request
    let offcanvasElement = document.getElementById('userAddCanvas');
    let offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvasInstance) offcanvasInstance.hide();

    // Send form data to the server
    fetch('../php/canvaData.php', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            toast: true,
            text: `New user created successfully with User ID: ${data.user_id} and Password: ${data.password}`,
            confirmButtonText: 'OK'
          }).then(() => {
            form.reset(); // Reset form
            form.querySelectorAll('input[type="hidden"]').forEach(input => (input.value = ''));

            // Add only the new user to the table
            addNewUserToTable(data);

            // Send WhatsApp Message
            sendWhatsAppMessage(data.fullname, data.user_id, data.password, data.phone);
          });
        } else {
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
        if (submitButton) submitButton.disabled = false;
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          position: 'top',
          toast: true,
          title: 'Oops...',
          text: 'Something went wrong. Please try again.',
          confirmButtonText: 'OK'
        });

        console.error('Fetch error:', error);

        if (submitButton) submitButton.disabled = false;
      });
  }

  // Function to send WhatsApp message
  function sendWhatsAppMessage(fullname, user_id, password, phone) {
    if (!phone) {
      console.error('Phone number is missing.');
      return;
    }

    fetch('/php/whatsapp/get_whatsapp_credentials.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, user_id, password, phone })
    })
      .then(response => {
        if (!response.ok) throw new Error('WhatsApp API response was not ok');
        return response.json();
      })
      .catch(error => console.error('WhatsApp API Error:', error));
  }

  // Function to format date
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Function to refresh the user table
  function addNewUserToTable(user) {
    let tableBody = document.querySelector('#userTable tbody');
    if (!tableBody) return;

    let avatar = user.user_role_avatar ? user.user_role_avatar : '../assets/img/avatars/default-avatar.png';

    // Determine dropdown menu options based on user status
    let dropdownMenu = '';
    if (user.status === 'Pending') {
      dropdownMenu = `
        <a class="dropdown-item border-bottom userEdit" href="javascript:;" id="userEdit" data-id="${user.user_id}">Edit</a>
        <a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>
      `;
    } else if (user.status === 'Active') {
      dropdownMenu = `
        <a class="dropdown-item border-bottom userEdit" href="javascript:;" id="userEdit" data-id="${user.user_id}">Edit</a>
        <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${user.user_id}">Suspend</a>
        <a class="dropdown-item userCredential" href="javascript:;" data-id="${user.user_id}">Send Credential</a>
      `;
    } else if (user.status === 'Suspended') {
      dropdownMenu = `<a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>`;
    }

    let row = document.createElement('tr');
    row.setAttribute('data-id', user.user_id);
    row.innerHTML = `
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
      <td>${formatDate(user.joining_date)}</td>
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
        <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm text-warning"
           data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
           <div class="dropdown-menu dropdown-menu-end">${dropdownMenu}</div>
      </td>
    `;

    tableBody.appendChild(row);
  }
});

// Function to validate mobile number
function validateMobileNumber(input) {
  input.value = input.value.replace(/\D/g, '');
  document.getElementById('phoneError').style.display = /^\d{10}$/.test(input.value) ? 'none' : 'block';
}
