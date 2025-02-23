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

      form.removeEventListener('submit', handleFormSubmit); // Remove existing listener
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
      text: 'Please wait while we process your request...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    let formData = new FormData(form);

    // Close the off-canvas before sending the request
    let offcanvasElement = document.getElementById('userAddCanvas');
    let offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    if (offcanvasInstance) offcanvasInstance.hide();

    // Determine if this is an edit operation
    let isEdit = form.dataset.edit === 'true';
    let userId = form.dataset.userId;

    // Send form data to the server
    fetch(isEdit ? `../php/canvaData.php?user_id=${userId}` : '../php/canvaData.php', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            toast: true,
            text: isEdit
              ? 'User updated successfully!'
              : `New user created successfully with User ID: ${data.user_id} and Password: ${data.password}`,
            confirmButtonText: 'OK'
          }).then(() => {
            form.reset(); // Reset form
            form.querySelectorAll('input[type="hidden"]').forEach(input => (input.value = ''));

            if (isEdit) {
              // Update the existing user in the table
              updateUserInTable(data);
            } else {
              // Add the new user to the table
             // addNewUserToTable(data);

              // Send WhatsApp Message
              sendWhatsAppMessage(data.fullname, data.user_id, data.password, data.phone, data.role, data.status);
              // Refresh the user list
              fetchUserList();
            }
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

  function fetchUserList() {
    fetch('../php/userRole/get_user_role.php') // Replace with your actual API endpoint
      .then(response => response.json())
      .then(users => {
        let userTable = document.getElementById('userTable');

        // Clear existing rows except the header
        userTable.querySelectorAll('tbody').forEach(tbody => tbody.remove());

        // Create a new tbody
        let tbody = document.createElement('tbody');

        users.forEach(user => {
          let row = document.createElement('tr');
          row.innerHTML = `
                <td style="text-align: center;"><input type="checkbox" class="select-user" data-user-id="${
                  user.id
                }"></td>
                <td style="text-align: center;">${user.id}</td>
                <td>${user.fullname}</td>
                <td>${user.role}</td>
                <td>${user.phone}</td>
                <td>${user.join_date}</td>
                <td>
                    <span class="badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}">
                        ${user.status}
                    </span>
                </td>
                <td style="text-align: center;">
                    <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;
          tbody.appendChild(row);
        });

        userTable.appendChild(tbody);
      })
      .catch(error => console.error('Error fetching user list:', error));
  }


/*
  function updateUserInTable(user) {
    let table = $('#userTable').DataTable(); // Get the DataTable instance
    let row = table.row(`[data-id="${user.user_id}"]`); // Find the row with the matching user ID

    if (row.length) {
      // Update the row data
      // let avatar = user.user_role_avatar || '../assets/img/avatars/default-avatar.png';
      // Get the existing avatar from the row (which was set from the frontend)
      let existingAvatar = row.find('.avatar img').attr('src');

      // Use the existing avatar if no new one is provided, otherwise use the new one
      let avatar =
        user.user_role_avatar && user.user_role_avatar !== 'null'
          ? user.user_role_avatar
          : existingAvatar || '../assets/img/avatars/default-avatar.png'; // ✅ Fallback to frontend default

      let dropdownMenu = '';
      if (user.status === 'Pending') {
        dropdownMenu = `<a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${user.user_id}">Edit</a>
         <a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>`;
      } else if (user.status === 'Active') {
        dropdownMenu = `<a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${user.user_id}">Edit</a>
         <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${user.user_id}">Suspend</a>
         <a class="dropdown-item userCredential" href="javascript:;" data-id="${user.user_id}">Send Credential</a>`;
      } else if (user.status === 'Suspended') {
        dropdownMenu = `<a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>`;
      }

      // Update the row data
      row
        .data([
          `<input type="checkbox" class="row-select">`,
          user.user_id,
          `<div class="d-flex align-items-center">
         <div class="avatar avatar-sm">
           <img src="${avatar}" alt="avatar" class="rounded-circle" />
         </div>
         <div class="ms-2">
           <h6 class="mb-0 ms-2">${user.fullname}</h6>
         </div>
       </div>`,
          user.role,
          user.phone,
          formatDate(user.joining_date),
          `<span class="badge ${user.status === 'Active' ? 'bg-label-success' : 'bg-label-warning'}">${
            user.status
          }</span>`,
          `<a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info userView" data-id="${user.user_id}" title="View User"></a>
       <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger userDelete" data-id="${user.user_id}" title="Delete User"></a>
       <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm text-warning" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
       <div class="dropdown-menu dropdown-menu-end">${dropdownMenu}</div>`
        ])
        .draw(false); // Redraw the table to reflect changes
    } else {
      console.error('Row not found for user ID:', user.user_id);
    }
  }


*/

/*
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
    let offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    if (offcanvasInstance) offcanvasInstance.hide();

    // Send form data to the server
    fetch('../php/canvaData.php', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
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
            sendWhatsAppMessage(data.fullname, data.user_id, data.password, data.phone, data.role, data.status);
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
*/



// Function to send WhatsApp message
  function sendWhatsAppMessage(fullname, user_id, password, phone, role, status) {
    if (!phone) {
      console.error('Phone number is missing.');
      return;
    }

    fetch('/php/whatsapp/get_whatsapp_credentials.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, user_id, password, phone, role, status })
    })
      .then(response => response.json())
      .catch(error => console.error('WhatsApp API Error:', error));
  }

  // Function to format date
  /***
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    let date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  }*/

    function formatDate(dateString) {
      if (!dateString) return 'N/A';
      let date = new Date(dateString);

      // Get day, month, and year
      let day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
      let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      let year = date.getFullYear();

      return `${day}-${month}-${year}`; // Return in DD-MM-YYYY format
    }

    function getDropdownMenu(user) {
      if (user.status === 'Pending') {
        return `
            <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${user.user_id}">Edit</a>
            <a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>
        `;
      } else if (user.status === 'Active') {
        return `
            <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${user.user_id}">Edit</a>
            <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${user.user_id}">Suspend</a>
            <a class="dropdown-item userCredential" href="javascript:;" data-id="${user.user_id}">Send Credential</a>
        `;
      } else if (user.status === 'Suspended') {
        return `<a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>`;
      }
      return ''; // Return empty if no status matches
    }


  window.addNewUserToTable = function (user) {
    let table = $('#userTable').DataTable(); // Get the DataTable instance

    let avatar = user.user_role_avatar ? user.user_role_avatar : '../assets/img/avatars/default-avatar.png';


    // Determine dropdown menu options based on user status
    /*
    let dropdownMenu = '';
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
      dropdownMenu = `<a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>`;
    }*/

    // Add new row to DataTable correctly
    let rowData = [
      `<input type="checkbox" class="row-select">`,
      user.user_id,
      `<div class="d-flex align-items-center">
            <div class="avatar avatar-sm">
                <img src="${avatar}" alt="avatar" class="rounded-circle" />
            </div>
            <div class="ms-2">
                <h6 class="mb-0 ms-2">${user.fullname}</h6>
            </div>
        </div>`,
      user.role,
      user.phone,
      formatDate(user.joining_date),
      `<span class="badge ${user.status === 'Active' ? 'bg-label-success' : 'bg-label-warning'}">${user.status}</span>`,
      `<a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info userView" data-id="${
        user.user_id
      }" title="View User"></a>
        <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger userDelete" data-id="${
          user.user_id
        }" title="Delete User"></a>
        <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm text-warning" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
        <div class="dropdown-menu dropdown-menu-end">${getDropdownMenu(user)}</div>
        `
    ];
    let newRow = table.row.add(rowData).draw(false); // Add row & draw
    let rowNode = table.row(newRow).node(); // Get the correct row node

    if (rowNode) {
      $(rowNode).attr('data-id', user.user_id); // Safe way to set attributes
    }
  };

});

// Function to validate mobile number
function validateMobileNumber(input) {
  input.value = input.value.replace(/\D/g, ''); // Remove non-digits
  let isValid = /^\d{10}$/.test(input.value);
  document.getElementById('phoneError').style.display = isValid ? 'none' : 'block';
}
