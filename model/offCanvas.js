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
  /*
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
  });  */

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


    function changeStatus(userId, newStatus) {
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
        });
    }

    function updateUserRow(userId, newStatus) {
      let row = document.querySelector(`.userView[data-id="${userId}"]`).closest('tr');
      if (!row) return;

      // Step 1: Highlight row with yellow flash effect
      row.style.transition = 'background-color 0.3s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
      row.style.backgroundColor = '#fff3cd'; // Yellow for brief attention

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
      // **Edit and update script
        // **Alert for Edit User**
       document.addEventListener('click', function (event) {
         if (event.target.classList.contains('userEdit')) {
           let userId = event.target.dataset.id;

        // Check if the modal is already loaded
        if (!document.getElementById('editUserModal')) {
            // Fetch the modal HTML from /html/model_user_edit/user_edit.html
            fetch('/html/model_user_edit/user_edit.html')
                .then(response => response.text())
                .then(html => {
                    // Insert modal into the body
                    document.body.insertAdjacentHTML('beforeend', html);

                    // Call function to fetch user data and open modal
                    openEditUserModal(userId);
                })
                .catch(error => console.error('Error loading edit modal:', error));
        } else {
            // If modal is already loaded, just open it
            openEditUserModal(userId);
        }
      }
     });


          // Function to fetch user data and open modal
          function openEditUserModal(userId) {
           fetch(`../php/userRole/get_user_details.php?user_id=${userId}`)
             .then(response => response.json())
             .then(data => {
               if (data.success) {
                 let user = data.user;

                 // Populate modal fields
                 document.getElementById('userIdInput').value = user.user_id;
                 document.getElementById('fullNameInput').value = user.fullname || '';
                 document.getElementById('qualificationInput').value = user.qualification || '';
                 document.getElementById('roleSelect').value = user.role || '';
                 document.getElementById('emailInput').value = user.email || '';
                 document.getElementById('phoneInput').value = user.phone || '';
                 document.getElementById('dobDateInput').value = user.dob || '';
                 document.getElementById('joiningDateInput').value = user.joining_date || '';
                 document.getElementById('statusSelect').value = user.status || '';
                 document.getElementById('genderSelect').value = user.gender || '';
                 document.getElementById('salaryInput').value = user.salary || '';
                 document.getElementById('aadharInput').value = user.aadhar_card || '';
                 document.getElementById('subjectInput').value = user.subject || '';
                 document.getElementById('userAddress').value = user.user_address || '';
                 document.getElementById('bankNameInput').value = user.bank_name || '';
                 document.getElementById('branchNameInput').value = user.branch_name || '';
                 document.getElementById('accountNumberInput').value = user.account_number || '';
                 document.getElementById('ifscCodeInput').value = user.ifsc_code || '';
                 document.getElementById('accountType').value = user.account_type || '';

                 // Update avatar preview
                 let avatarImg = document.getElementById('userAvatar');
                 avatarImg.src = user.user_role_avatar ? user.user_role_avatar : '/assets/img/avatars/default-avatar.png';
                 let avatarInput = document.getElementById('avatarUpload');

                 // Show image preview when file is selected
                 avatarInput.addEventListener('change', function () {
                   if (avatarInput.files && avatarInput.files[0]) {
                     let reader = new FileReader();
                     reader.onload = function (e) {
                       avatarImg.src = e.target.result; // Set the preview image
                     };
                     reader.readAsDataURL(avatarInput.files[0]); // Read file as DataURL
                   }
                 });

                 // Show modal
                 let editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
                 editUserModal.show();

                 // Attach the event listener for saving user changes **AFTER** the modal is loaded
                   document.getElementById('saveUserChanges').addEventListener('click', saveUserChanges);
               } else {
                 alert('Error: ' + data.message);
               }
             })
             .catch(error => console.error('Error fetching user data:', error));
         }

         //** save user changes

         function saveUserChanges() {
           let formData = new FormData();

           // Capture input values
           formData.append('user_id', document.getElementById('userIdInput').value);
           formData.append('fullname', document.getElementById('fullNameInput').value);
           formData.append('qualification', document.getElementById('qualificationInput').value);
           formData.append('role', document.getElementById('roleSelect').value);
           formData.append('email', document.getElementById('emailInput').value);
           formData.append('phone', document.getElementById('phoneInput').value);
           formData.append('dob', document.getElementById('dobDateInput').value);
           formData.append('joining_date', document.getElementById('joiningDateInput').value);
           formData.append('status', document.getElementById('statusSelect').value);
           formData.append('gender', document.getElementById('genderSelect').value);
           formData.append('salary', document.getElementById('salaryInput').value);
           formData.append('aadhar_card', document.getElementById('aadharInput').value);
           formData.append('subject', document.getElementById('subjectInput').value);
           formData.append('user_address', document.getElementById('userAddress').value);
           formData.append('bank_name', document.getElementById('bankNameInput').value);
           formData.append('branch_name', document.getElementById('branchNameInput').value);
           formData.append('account_number', document.getElementById('accountNumberInput').value);
           formData.append('ifsc_code', document.getElementById('ifscCodeInput').value);
           formData.append('account_type', document.getElementById('accountType').value);

           // Append avatar file if selected
           let avatarFile = document.getElementById('avatarUpload').files[0];
           if (avatarFile) {
             formData.append('avatar', avatarFile);
           }

           // Send data to PHP
           fetch('/php/userRole/update_user_details.php', {
             method: 'POST',
             body: formData
           })
             .then(response => response.json())
             .then(data => {
               if (data.success) {
                 alert('User updated successfully!');
                 let editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                 editUserModal.hide(); // Close modal after saving
                 location.reload(); // Reload page to reflect changes (optional)
               } else {
                 alert('Error: ' + data.message);
               }
             })
             .catch(error => console.error('Error updating user:', error));
         }
*/

    document.addEventListener('click', function (event) {
      if (event.target.classList.contains('userEdit')) {
        let userId = event.target.dataset.id;

        if (!document.getElementById('editUserModal')) {
          fetch('/html/model_user_edit/user_edit.html')
            .then(response => response.text())
            .then(html => {
              document.body.insertAdjacentHTML('beforeend', html);
              openEditUserModal(userId);
            })
            .catch(error => console.error('Error loading edit modal:', error));
        } else {
          openEditUserModal(userId);
        }
      }
    });

    function openEditUserModal(userId) {
      fetch(`../php/userRole/get_user_details.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            let user = data.user;

            let fields = [
              'userIdInput',
              'fullNameInput',
              'qualificationInput',
              'roleSelect',
              'emailInput',
              'phoneInput',
              'dobDateInput',
              'joiningDateInput',
              'statusSelect',
              'genderSelect',
              'salaryInput',
              'aadharInput',
              'subjectInput',
              'userAddress',
              'bankNameInput',
              'branchNameInput',
              'accountNumberInput',
              'ifscCodeInput',
              'accountType'
            ];

            fields.forEach(field => {
              let input = document.getElementById(field);
              input.value = user[field.replace('Input', '').replace('Select', '')] || '';
            });

            let avatarImg = document.getElementById('userAvatar');
            avatarImg.src = user.user_role_avatar || '/assets/img/avatars/default-avatar.png';
            let avatarInput = document.getElementById('avatarUpload');

            avatarInput.addEventListener('change', function () {
              if (avatarInput.files && avatarInput.files[0]) {
                let reader = new FileReader();
                reader.onload = e => (avatarImg.src = e.target.result);
                reader.readAsDataURL(avatarInput.files[0]);
              }
            });

            let editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal.show();

            let saveButton = document.getElementById('saveUserChanges');
            saveButton.disabled = true;

            document.querySelectorAll('#editUserModal input, #editUserModal select').forEach(input => {
              input.addEventListener('input', () => {
                saveButton.disabled = false;
              });
            });

            saveButton.addEventListener('click', saveUserChanges);
          } else {
            showToast('Error: ' + data.message, 'danger');
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    }

    function saveUserChanges() {
      let saveButton = document.getElementById('saveUserChanges');
      let progressBar = document.getElementById('uploadProgress');
      let spinner = document.getElementById('loadingSpinner');

      saveButton.disabled = true;
      spinner.style.display = 'inline-block';
      progressBar.style.width = '0%';

      let formData = new FormData();
      let fields = [
        'userIdInput',
        'fullNameInput',
        'qualificationInput',
        'roleSelect',
        'emailInput',
        'phoneInput',
        'dobDateInput',
        'joiningDateInput',
        'statusSelect',
        'genderSelect',
        'salaryInput',
        'aadharInput',
        'subjectInput',
        'userAddress',
        'bankNameInput',
        'branchNameInput',
        'accountNumberInput',
        'ifscCodeInput',
        'accountType'
      ];

      fields.forEach(field => {
        formData.append(field.replace('Input', '').replace('Select', ''), document.getElementById(field).value);
      });

      let avatarFile = document.getElementById('avatarUpload').files[0];
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/php/userRole/update_user_details.php', true);

      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          let percent = Math.round((event.loaded / event.total) * 100);
          progressBar.style.width = percent + '%';
        }
      };

      xhr.onload = function () {
        spinner.style.display = 'none';
        progressBar.style.width = '100%';

        let response = JSON.parse(xhr.responseText);
        if (response.success) {
          showToast('User updated successfully!', 'success');
          let editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
          editUserModal.hide();
          setTimeout(() => location.reload(), 1000);
        } else {
          showToast('Error: ' + response.message, 'danger');
          saveButton.disabled = false;
        }
      };

      xhr.onerror = function () {
        spinner.style.display = 'none';
        showToast('Error updating user. Please try again.', 'danger');
        saveButton.disabled = false;
      };

      xhr.send(formData);
    }

    function showToast(message, type) {
      let toastContainer = document.getElementById('toastContainer');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
      }

      let toast = document.createElement('div');
      toast.className = `toast align-items-center text-bg-${type} border-0 show`;
      toast.style.minWidth = '250px';
      toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

      toastContainer.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    }





      // **Alert for View User**
      document.addEventListener('click', function (event) {
          if (event.target.classList.contains('userView')) {
              let userId = event.target.dataset.id;
              alert(`View User: ID ${userId}`);
              // You can open a modal or navigate to a details page here
          }
      });

      // **Alert for Delete User**
      document.addEventListener('click', function (event) {
          if (event.target.classList.contains('userDelete')) {
              let userId = event.target.dataset.id;
              if (confirm(`Are you sure you want to delete user ID ${userId}?`)) {
                  alert(`User ID ${userId} has been deleted.`);
                  // You can call a function to delete the user from the database here
              }
          }
      });

      /*
      document.addEventListener('click', function (event) {
        if (event.target.classList.contains('userCredential')) {
          let userId = event.target.dataset.id;
          let button = event.target;
          button.disabled = true; // Prevent multiple clicks

          // AJAX request to fetch user credentials from the server
          $.ajax({
            url: '/php/whatsapp/getUserCredentials.php', // Backend script to fetch credentials
            type: 'POST',
            data: { user_id: userId }, // Send the user ID to the backend
            dataType: 'json', // Expect JSON response
            success: function (response) {
              if (response.success) {
                let fullName = response.data.fullname;
                let password = response.data.password;
                let phone = response.data.phone;
                let fromName = response.data.fromName;

                // Display confirmation before sending credentials
                if (confirm(`Send credentials to:\nFull Name: ${fullName}\nPhone: ${phone}`)) {
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
                    dataType: 'json',
                    success: function (sendResponse) {
                      console.log('Success:', sendResponse);
                      alert('Credentials sent successfully!');
                    },
                    error: function (xhr) {
                      console.error('Error:', xhr.responseText);
                      alert('Failed to send credentials.');
                    },
                    complete: function () {
                      button.disabled = false; // Re-enable button
                    }
                  });
                } else {
                  button.disabled = false; // Re-enable if user cancels
                }
              } else {
                alert('User credentials not found.');
                button.disabled = false; // Re-enable button
              }
            },
            error: function (xhr) {
              console.error('Error fetching credentials:', xhr.responseText);
              alert('Error retrieving user credentials.');
              button.disabled = false; // Re-enable button
            }
          });
        }
      });
*/

        //**SEnd credentials */
          document.addEventListener('click', function (event) {
            if (event.target.classList.contains('userCredential')) {
              let userId = event.target.dataset.id;
              let button = event.target;
              button.disabled = true; // Prevent multiple clicks

              // Fetch user credentials from the server
              $.ajax({
                url: '/php/whatsapp/getUserCredentials.php',
                type: 'POST',
                data: { user_id: userId },
                dataType: 'json',
                success: function (response) {
                  if (response.success) {
                    let { fullname, password, phone, fromName } = response.data;

                    // Use SweetAlert2 for confirmation
                    Swal.fire({
                      title: 'Send Credentials?',
                      html: `<b>Name:</b> ${fullname}<br><b>Phone:</b> ${phone}`,
                      icon: 'info',
                      showCancelButton: true,
                      confirmButtonText: 'Send Now',
                      cancelButtonText: 'Cancel',
                      confirmButtonColor: '#28a745',
                      cancelButtonColor: '#d33'
                    }).then(result => {
                      if (result.isConfirmed) {
                        sendCredentials(userId, fullname, password, phone, fromName, button);
                      } else {
                        button.disabled = false; // Re-enable if canceled
                      }
                    });
                  } else {
                    toastr.error('User credentials not found.', 'Error');
                    button.disabled = false;
                  }
                },
                error: function (xhr) {
                  console.error('Error fetching credentials:', xhr.responseText);
                  toastr.error('Error retrieving user credentials.', 'Error');
                  button.disabled = false;
                }
              });
            }
          });

          function sendCredentials(userId, fullName, password, phone, fromName, button) {
            $.ajax({
              url: '/php/whatsapp/sendUserRoleCred.php',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ fullName, user_id: userId, password, phone, fromName }),
              dataType: 'json',
              success: function (sendResponse) {
                console.log('Success:', sendResponse);
                toastr.success('Credentials sent successfully!', 'Success');
              },
              error: function (xhr) {
                console.error('Error:', xhr.responseText);
                toastr.error('Failed to send credentials.', 'Error');
              },
              complete: function () {
                button.disabled = false; // Re-enable button after request
              }
            });
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
