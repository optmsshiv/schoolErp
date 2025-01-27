document.addEventListener('DOMContentLoaded', function () {
  //  console.log('DOM fully loaded');

  // Load off-canvas HTML dynamically
  fetch('../model/offCanvas.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load offCanvas.html');
      }
      return response.text();
    })
    .then(data => {
      // Insert fetched HTML into the placeholder
      document.getElementById('offcanvasAddUser').innerHTML = data;

      // Initialize off-canvas logic after loading HTML
      initializeOffCanvas();
    })
    .catch(error => {
      console.error('Error loading offCanvas.html:', error);
    });

  // Function to initialize off-canvas behavior
  function initializeOffCanvas() {
    var offcanvas = document.getElementById('userAddCanvas');
    var form;

    if (offcanvas) {
      offcanvas.addEventListener('shown.bs.offcanvas', function () {
        //  console.log('Off-canvas shown');

        form = document.getElementById('addNewUser');
        //  console.log('Form element:', form);

        if (form) {
          //  console.log('Form found, adding event listener');

          // Add submit event listener to the form
          form.addEventListener('submit', function (event) {
            event.preventDefault();

            var formData = new FormData(this);

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
                  Swal.fire({
                    target: document.getElementById('userAddCanvas'),
                    icon: 'success',
                    title: 'Success!',
                    position: 'top', // Change position to top
                    toast: true, // Makes the alert appear as a toast
                    text: `New user created successfully with User ID: ${data.userId} and Password: ${data.password}`,
                    confirmButtonText: 'OK'
                  }).then(() => {
                    form.reset();
                    var bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                    bsOffcanvas.hide();

                    // Refresh the user table
                    refreshUserTable();
                  });
                } else {
                  Swal.fire({
                    target: document.getElementById('userAddCanvas'),
                    icon: 'error',
                    position: 'top', // Change position to top
                    toast: true, // Makes the alert appear as a toast
                    title: 'Oops...',
                    text: data.message || 'Something went wrong. Please try again.',
                    confirmButtonText: 'OK'
                  });
                }
              })
              .catch(error => {
                Swal.fire({
                  target: document.getElementById('userAddCanvas'),
                  icon: 'error',
                  position: 'top', // Change position to top
                  toast: true, // Makes the alert appear as a toast
                  title: 'Oops...',
                  text: 'Something went wrong. Please try again.',
                  confirmButtonText: 'OK'
                });
                console.error('Fetch error:', error);
              });
          });
        } else {
          console.error('Form element not found');
        }
      });
    } else {
      console.error('Off-canvas element not found');
    }
  }
  // Function to refresh the user table
  function refreshUserTable() {
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
                <td><span class="badge ${user.status === 'Active' ? 'bg-label-success' : user.status === 'Suspended' ? 'bg-label-secondary' : 'bg-label-danger'}">${
              user.status
            }</span></td>
                <td>
                  <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info" id="userView" data-id="${
                    user.user_id
                  }"></a>
                  <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" id="userDelete" data-id="${
                    user.user_id
                  }"></a>
                  <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm me-2 text-warning" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="javascript:;" id="userEdit" data-id="${user.user_id}">Edit</a>
                    <a class="dropdown-item" href="javascript:;" id="userSuspend" data-id="${user.user_id}">Suspend</a>
                  </div>
                </td>
              </tr>
            `;
            tableBody.append(row); // Add the new row to the table
          });

          // Reinitialize DataTable after adding rows dynamically
          var table = $('#userTable').DataTable();
          table.clear();
          table.rows.add($('#userTable tbody tr')).draw();
        } else {
          alert('No users found!');
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX error: ' + status + ': ' + error);
      },
    });
  }
});
