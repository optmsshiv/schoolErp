let currentPage = 1;
let rowsPerPage = parseInt(document.getElementById('customLength').value); // Default value
let isFetching = false; // ✅ Prevent multiple simultaneous requests
let searchQuery = ""; // Store search query globally

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

  //fetch form backened
  fetchUserList(currentPage, rowsPerPage);

  // ✅ Update rows per page when changed
  const customLengthElement = document.getElementById('customLength');
  if (customLengthElement) {
    customLengthElement.addEventListener('change', function () {
      rowsPerPage = parseInt(this.value, 10) || 10;
      currentPage = 1; // Reset to the first page when changing rows per page
      fetchUserList(currentPage, rowsPerPage, searchQuery);
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

            // add new user row into the table
            addNewUserToTable(data);

            // Send WhatsApp Message
            //  sendWhatsAppMessage(data.fullname, data.user_id, data.password, data.phone, data.role, data.status);
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

  function fetchUserList(page = 1, limit = rowsPerPage, search = searchQuery) {
    if (isFetching) return; // ✅ Prevent duplicate calls
    isFetching = true;

    let userTable = document.getElementById('userTable');
    let tbody = userTable.querySelector('tbody');
    let paginationDiv = document.getElementById('paginationControls');
    let paginationInfo = document.getElementById('paginationInfo'); // ✅ Element for pagination info
    let loadingBarContainer = document.getElementById('loadingBarContainer');
    let loadingBar = document.getElementById('loadingBar');
    let loadingSpinner = document.getElementById('loadingSpinner');

    document.getElementById('customLength').disabled = true;
    paginationDiv.innerHTML = '';
    paginationInfo.innerHTML = 'Loading...'; // ✅ Show loading text

    // Show the loading bar
   // loadingSpinner.style.display = 'inline-block'; //use this when to show the html spinner
    loadingBarContainer.style.display = 'block';
    loadingBar.style.width = '10%';
    loadingBar.style.animation = 'progressBar 1.5s ease-in-out infinite';

    // Show a loading message while fetching data
    if (!tbody) {
      tbody = document.createElement('tbody');
      userTable.appendChild(tbody);
    }
    tbody.innerHTML = `<tr>
                        <td colspan="8" class="text-center">
                        <div class="d-flex justify-content-center align-items-center">
                           <div class="spinner-border text-primary me-2" role="status">
                             <span class="visually-hidden">Loading...</span>
                           </div>
                           <span>Loading...</span>
                          </div>
                        </td>
                        </tr>`;


    fetch(`/php/userRole/get_user_role.php?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`) // Replace with your actual API endpoint
      .then(response => {
        loadingBar.style.width = '50%'; // Halfway progress
        return response.json();
      })

      .then(data => {
        let users = data.users;
        let totalRecords = data.total;
        let totalPages = Math.ceil(data.total / limit);
        let start = (page - 1) * limit + 1;
        let end = Math.min(page * limit, totalRecords);

        tbody.innerHTML = ''; // Clear previous rows

        if (users.length === 0) {
          tbody.innerHTML = `<tr class="no-users-row"><td colspan="8" class="text-center text-muted">No users found.</td></tr>`;
        } else {
          let fragment = document.createDocumentFragment();

          users.forEach(user => {
            let avatar = user.user_role_avatar?.trim()
              ? user.user_role_avatar
              : '../assets/img/avatars/default-avatar.png';

            // console.log(avatar); // Output: '../assets/img/avatars/default-avatar.png'

            // Determine dropdown menu options based on user status
            let dropdownMenu = '';
            switch (user.status) {
              case 'Pending':
                dropdownMenu = `
                            <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${user.user_id}">Edit</a>
                            <a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>`;
                break;
              case 'Active':
                dropdownMenu = `
                            <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${user.user_id}">Edit</a>
                            <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${user.user_id}">Suspend</a>
                            <a class="dropdown-item userCredential" href="javascript:;" data-id="${user.user_id}">Send Credential</a>`;
                break;
              case 'Suspended':
                dropdownMenu = `<a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>`;
                break;
            }

            // Create row for user

            let row = document.createElement('tr');
           // row.classList.add('fade-in'); // Add animation class
            row.classList.add('tr-animate'); // Add animation class
            row.innerHTML = `
                <td><input type="checkbox" class="form-check-input"></td>
                <td>${user.user_id}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar avatar-sm">
                      <img src="${avatar}" alt="avatar" class="rounded-circle" loading="lazy" />
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
                  <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info userView" id="userView" data-id="${
                    user.user_id
                  }" title="View User"></a>
                  <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger userDelete" id="userDelete" data-id="${
                    user.user_id
                  }" title="Delete User"></a>
                  <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm text-warning"
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                  <div class="dropdown-menu dropdown-menu-end">${dropdownMenu}</div>
                </td>
            `;
            fragment.appendChild(row);
          });
          tbody.appendChild(fragment); // Append all rows at once (performance boost)
        }
        // ✅ Update total user count in footer
        document.getElementById('totalRecords').textContent = users.length;
        updatePaginationControls(totalPages, totalRecords, start, end);

        //  userTable.appendChild(tbody);
        loadingBar.style.width = '100%'; // Complete progress
        setTimeout(() => {
          loadingBarContainer.style.display = 'none'; // Hide after 500ms
         // loadingSpinner.style.display = 'none';
        }, 500);

        document.getElementById('customLength').disabled = false;
      })
      .catch(error => {
        console.error('Error fetching user list:', error);
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Failed to load data</td></tr>`;
        loadingBarContainer.style.display = 'none'; // Hide loading bar on error
        loadingSpinner.style.display = 'none';
      })
      .finally(() => {
        isFetching = false;
      });
  }

  // ✅ Pagination Controls
  function updatePaginationControls(totalPages, totalRecords, start, end) {
    let paginationDiv = document.getElementById('paginationControls');
    let paginationInfo = document.getElementById('paginationInfo'); // ✅ Create an element for pagination info

    if (!paginationDiv) {
      console.error('Pagination controls container not found!');
      return;
    }

    paginationDiv.innerHTML = ''; // Clear previous buttons
    // ✅ Update pagination info text
    paginationInfo.innerHTML = `Showing ${start} to ${end} of ${totalRecords} entries`;

    // Previous Button
    let prevButton = document.createElement('button');
    prevButton.className = 'btn btn-sm btn-secondary mx-1';
    prevButton.innerText = 'Prev';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchUserList(currentPage);
      }
    });
    paginationDiv.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      let button = document.createElement('button');
      button.className = `btn btn-sm btn-primary mx-1 ${i === currentPage ? 'active' : ''}`;
      button.innerText = i;
      button.addEventListener('click', () => {
        currentPage = i;
        fetchUserList(i);
      });
      paginationDiv.appendChild(button);
    }

    // Next Button
    let nextButton = document.createElement('button');
    nextButton.className = 'btn btn-sm btn-secondary mx-1';
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchUserList(currentPage);
      }
    });
    paginationDiv.appendChild(nextButton);
  }

  // ✅ Search Filter
  let searchTimeout;

  document.getElementById('searchBox').addEventListener('input', function () {
    clearTimeout(searchTimeout); // Clear previous timer

    searchQuery = this.value.trim().toLowerCase();
    currentPage = 1; // Reset to first page when searching

    searchTimeout = setTimeout(() => {
      fetchUserList(currentPage, rowsPerPage, searchQuery);
    }, 300); // Debounce to wait 300ms after typing stops
  });

  // ✅ Auto Refresh Every 5m
  setInterval(() => fetchUserList(currentPage, rowsPerPage, searchQuery), 500000);

  // ✅ Event Delegation for Efficient Event Handling
  document.getElementById('userTable').addEventListener('click', function (e) {
    let target = e.target;
    let userId = target.dataset.id;

    if (target.classList.contains('userEdit')) {
      editUser(userId);
    } else if (target.classList.contains('userDelete')) {
      deleteUser(userId);
    } else if (target.classList.contains('userActivate')) {
      activateUser(userId);
    } else if (target.classList.contains('userSuspend')) {
      suspendUser(userId);
    } else if (target.classList.contains('userCredential')) {
      sendUserCredential(userId);
    }
  });

  // ✅ Load Data on Page Load
  //  document.addEventListener('DOMContentLoaded', () => fetchUserList(currentPage, rowsPerPage));

  // add new user to table row

  function addNewUserToTable(user) {
    let userTable = document.getElementById('userTable');
    let tbody = userTable.querySelector('tbody');

    let noUsersRow = tbody.querySelector('tr.no-users-row');
    if (noUsersRow) {
      noUsersRow.remove();
    }

    if (!tbody) {
      tbody = document.createElement('tbody');
      userTable.appendChild(tbody);
    }

    let avatar =
      user.user_role_avatar && user.user_role_avatar.trim() !== ''
        ? user.user_role_avatar
        : '../assets/img/avatars/default-avatar.png';

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
      dropdownMenu = `
            <a class="dropdown-item userActivate" href="javascript:;" data-id="${user.user_id}">Activate</a>
        `;
    }

    let row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" class="form-check-input"></td>
        <td>${user.user_id}</td>
        <td>
            <div class="d-flex align-items-center">
                <div class="avatar avatar-sm">
                    <img src="${avatar}" alt="avatar" class="rounded-circle" loading="lazy" />
                </div>
                <div class="ms-2">
                    <h6 class="mb-0 ms-2">${user.fullname}</h6>
                </div>
            </div>
        </td>
        <td>${user.role}</td>
        <td>${user.phone}</td>
        <td>${formatDate(user.joining_date)}</td>
        <td>
            <span class="badge ${
              user.status === 'Active'
                ? 'bg-label-success'
                : user.status === 'Suspended'
                ? 'bg-label-secondary'
                : 'bg-label-warning'
            }">
                ${user.status}
            </span>
        </td>
        <td>
            <a href="javascript:;" class="tf-icons bx bx-show bx-sm me-2 text-info userView" data-id="${
              user.user_id
            }" title="View User"></a>
            <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger userDelete" data-id="${
              user.user_id
            }" title="Delete User"></a>
                <a href="javascript:;" class="tf-icons bx bx-dots-vertical-rounded bx-sm text-warning"
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More Options"></a>
                <div class="dropdown-menu dropdown-menu-end">
                    ${dropdownMenu}
                </div>
        </td>
    `;

    tbody.appendChild(row);
  }

  // script to listen for clicks on Activate and Suspend actions

    document.addEventListener('click', function (event) {
      let target = event.target;

      if (target.classList.contains('userActivate')) {
        let userId = target.getAttribute('data-id');
        if (confirm('Are you sure you want to activate this user?')) {
          changeStatus(userId, 'Active');
        }
      } else if (target.classList.contains('userSuspend')) {
        let userId = target.getAttribute('data-id');
        if (confirm('Are you sure you want to suspend this user?')) {
          changeStatus(userId, 'Suspended');
        }
      }
    });

    function showLoadingSpinner() {
      let spinner = document.createElement('div');
      spinner.classList.add('loading-spinner');
      spinner.textContent = 'Loading...';
      document.body.appendChild(spinner);
    }

    function hideLoadingSpinner() {
      let spinner = document.querySelector('.loading-spinner');
      if (spinner) spinner.remove();
    }


    function changeStatus(userId, newStatus, button) {
      if (!button) return;

      button.classList.add('loading'); // Add spinner animation
      showLoadingSpinner();

      fetch('../php/userRole/update_user_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `user_id=${encodeURIComponent(userId)}&status=${encodeURIComponent(newStatus)}`
      })
        .then(response => response.json())
        .then(data => {
          hideLoadingSpinner();
          if (data.success) {
            showToast(`User status changed to ${newStatus}`, newStatus === 'Active' ? 'success' : 'error');
            updateUserRow(userId, newStatus);
          } else {
            showToast('Failed to update status', 'error');
          }
        })
        .catch(() => {
          hideLoadingSpinner();
          showToast('An error occurred. Please try again.', 'error');
        })
        .finally(() => {
          button.classList.remove('loading'); // Remove spinner
        });
    }

    function updateUserRow(userId, newStatus) {
      let row = document.querySelector(`.userView[data-id="${userId}"]`).closest('tr');
      if (!row) return;

      // Step 1: Highlight row with yellow flash effect
      row.style.transition = 'background-color 0.3s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
      row.style.backgroundColor = '#fff3cd'; // Yellow for brief attention
      row.style.transform = 'translateX(5px)'; // Slide effect

      setTimeout(() => {
        // Step 2: Apply final background and glow effect
        row.style.opacity = '0.5'; // Fade effect

        if (newStatus === 'Active') {
          row.style.backgroundColor = '#d4edda'; // Light green
          row.style.boxShadow = '0px 0px 15px rgba(40, 167, 69, 0.8)'; // Green glow
        } else if (newStatus === 'Suspended') {
          row.style.backgroundColor = '#f8d7da'; // Light red
          row.style.boxShadow = '0px 0px 15px rgba(220, 53, 69, 0.8)'; // Red glow
        }

        setTimeout(() => {
          row.style.opacity = '1';
          row.style.backgroundColor = '';
          row.style.boxShadow = '';
          row.style.transform = 'translateX(0)'; // Reset position
        }, 800);
      }, 400);

      // Update status badge with a pulse effect
      let statusCell = row.children[6]; // Assuming status is in the 7th column
      let badge = statusCell.querySelector('span');

      if (badge) {
        badge.className = `badge ${newStatus === 'Active' ? 'bg-label-success' : 'bg-label-secondary'}`;
        badge.textContent = newStatus;
         badge.style.animation = 'pulse 0.5s ease-in-out';
      }

      // Update dropdown options
      let dropdownMenu = '';
      if (newStatus === 'Active') {
        dropdownMenu = `
                <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${userId}">Edit</a>
                <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${userId}">Suspend</a>
                <a class="dropdown-item userCredential" href="javascript:;" data-id="${userId}">Send Credential</a>
            `;
      } else if (newStatus === 'Suspended') {
        dropdownMenu = `<a class="dropdown-item userActivate" href="javascript:;" data-id="${userId}">Activate</a>`;
      }

      let dropdown = row.querySelector('.dropdown-menu');
      if (dropdown) {
        dropdown.innerHTML = dropdownMenu;
      }
    }

    function showToast(message, type) {
      let toast = document.createElement('div');
      toast.className = `custom-toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
      toast.innerHTML = `<span>${message}</span>`;
      document.body.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 3000);
    }

/*
function changeStatus(userId, newStatus, targetElement) {
  fetch('../php/userRole/update_user_status.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, status: newStatus })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update the UI
        let row = targetElement.closest('tr');
        let statusBadge = row.querySelector('td span.badge');
        let dropdownMenu = row.querySelector('.dropdown-menu');

        // Change badge color and text
        statusBadge.textContent = newStatus;
        statusBadge.className = `badge ${
          newStatus === 'Active'
            ? 'bg-label-success'
            : newStatus === 'Suspended'
            ? 'bg-label-secondary'
            : 'bg-label-warning'
        }`;

        // Update dropdown options based on new status
        let newDropdownMenu = '';
        if (newStatus === 'Active') {
          newDropdownMenu = `
                    <a class="dropdown-item border-bottom userEdit" href="javascript:;" data-id="${userId}">Edit</a>
                    <a class="dropdown-item border-bottom userSuspend" href="javascript:;" data-id="${userId}">Suspend</a>
                    <a class="dropdown-item userCredential" href="javascript:;" data-id="${userId}">Send Credential</a>
                `;
        } else if (newStatus === 'Suspended') {
          newDropdownMenu = `
                    <a class="dropdown-item userActivate" href="javascript:;" data-id="${userId}">Activate</a>
                `;
        }

        dropdownMenu.innerHTML = newDropdownMenu; // Replace dropdown options dynamically
      } else {
        alert('Failed to update status.');
      }
    })
    .catch(error => console.error('Error:', error));
}
*/
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
});

// Function to validate mobile number
function validateMobileNumber(input) {
  input.value = input.value.replace(/\D/g, ''); // Remove non-digits
  let isValid = /^\d{10}$/.test(input.value);
  document.getElementById('phoneError').style.display = isValid ? 'none' : 'block';
}
