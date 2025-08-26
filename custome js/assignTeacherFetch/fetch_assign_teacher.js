document.addEventListener('DOMContentLoaded', function () {
  // Load dropdowns
  fetch('../php/assignTeacher/fetch_dropdowns.php')
    .then(res => res.json())
    .then(data => {
      let classSelect = document.getElementById('classTeachers');
      let teacherSelect = document.getElementById('teacherName');

      data.classes.forEach(c => {
        classSelect.innerHTML += `<option value="${c.class_id}">${c.class_name}</option>`;
      });

      data.teachers.forEach(t => {
        teacherSelect.innerHTML += `<option value="${t.id}">${t.fullname}</option>`;
      });
    });

  // Handle form submit
  document.getElementById('classTeacherForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Saving...`;

    let formData = new FormData(this);

    fetch('../php/assignTeacher/assign_teacher.php', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json()) // convert response to JSON
      .then(response => {
        if (response.status === 'success') {
          showToast(response.message, 'success');
          submitBtn.classList.add('loading');
          loadAssignments(true); // ✅ refresh
        } else if (response.status === 'warning') {
          showToast(response.message, 'warning');
        } else {
          showToast(response.message, 'warning'); // server-side failure
          this.classList.add('form-error');
          setTimeout(() => this.classList.remove('form-error'), 500);
          loadAssignments(true); // ✅ refresh on server-side failure
        }
      })
      .catch(error => {
        showToast('Something went wrong: ' + error.message, 'danger'); // network failure
        this.classList.add('form-error');
        setTimeout(() => this.classList.remove('form-error'), 500);
        loadAssignments(); // ✅ refresh on network/JSON failure
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
      });
  });



  // show toast
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');

    // Base classes
    toast.classList.add('toast', 'align-items-center', 'border-0', 'mb-2', 'show', 'slide-in');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    // Handle colors
    if (type === 'warning') {
      toast.classList.add('bg-info', 'text-white'); // yellow with dark text
    } else {
      toast.classList.add(`text-bg-${type}`); // success, danger, info...
    }

    toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
    </div>
  `;

    toastContainer.appendChild(toast);

    // Remove on close button click (with slide-out)
    const closeBtn = toast.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('slide-in');
      toast.classList.add('slide-out');
      setTimeout(() => toast.remove(), 500);
    });

    // Auto remove after 5 sec
    setTimeout(() => {
      toast.classList.remove('slide-in');
      toast.classList.add('slide-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = 2000;
    document.body.appendChild(container);
    return container;
  }



  // Load existing assignments
  function loadAssignments(withAnimation = false) {
    fetch('../php/assignTeacher/fetch_assignments.php')
      .then(res => res.json())
      .then(data => {
        let tbody = document.getElementById('assignedTeacher');
        tbody.innerHTML = '';
        data.forEach((row, index) => {
          tbody.innerHTML += `
            <tr class="table-row ${withAnimation ? '' : 'show'}"> <!-- add class for animation -->
              <td>${index + 1}</td>
              <td>${row.class_name}</td>
              <td>${row.teacher_name}</td>
              <td>${row.assigned_date}</td>
              <td>${row.updated_at}</td>
              <td>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}">Delete</button>
              </td>
            </tr>`;
          // Example: after inserting rows into table

          //const rows = document.querySelectorAll('.table-row');
          if (withAnimation) {
            const rows = document.querySelectorAll('.table-row');
            rows.forEach((row, i) => {
              row.classList.remove('show', 'pulse'); // reset states
              setTimeout(() => {
                row.classList.add('show');
                if (i === 0) row.classList.add('pulse'); // highlight first/new row
              }, i * 100); // stagger fade-in
            });
          }

        });

        // Attach delete event
        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', function () {
            if (confirm('Are you sure you want to remove this teacher from class?')) {
              let id = this.getAttribute('data-id');
              let formData = new FormData();
              formData.append('id', id);

              fetch('../php/assignTeacher/delete_teacher.php', {
                method: 'POST',
                body: formData
              })
                .then(res => res.json())
                .then(response => {
                  if (response.status === 'success') {
                    showToast(response.message, 'danger');
                    loadAssignments();
                  } else {
                    showToast(response.message, 'warning');
                  }
                })
                .catch(error => {
                  showToast('Error: ' + error.message, 'danger');
                });
            }
          });
        });
      });
  }

  loadAssignments();
});
