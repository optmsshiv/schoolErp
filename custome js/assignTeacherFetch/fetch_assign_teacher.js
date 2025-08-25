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

    let formData = new FormData(this);

    fetch('../php/assignTeacher/assign_teacher.php', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json()) // convert response to JSON
      .then(response => {
        if (response.status === 'success') {
          showToast(response.message, 'success');
          loadAssignments();
        } else {
          showToast(response.message, 'danger');
        }
      })

      // Delete response
      .then(response => {
        showToast(response.message, 'warning');
        loadAssignments(); // refresh table
      });
  });

  // show toast

  function showToast(message, type = "primary") {
    let container = document.getElementById("toastContainer");

    // Create toast element
    let toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-white bg-${type} border-0 mb-2`;
    toastEl.setAttribute("role", "alert");
    toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

    // Append toast to container
    container.appendChild(toastEl);

    // Initialize Bootstrap toast
    let toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    // Remove toast from DOM after hidden
    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
  }


  // Load existing assignments
  function loadAssignments() {
    fetch('../php/assignTeacher/fetch_assignments.php')
      .then(res => res.json())
      .then(data => {
        let tbody = document.getElementById('assignedTeacher');
        tbody.innerHTML = '';
        data.forEach((row, index) => {
          tbody.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${row.class_name}</td>
              <td>${row.teacher_name}</td>
              <td>${row.assigned_date}</td>
              <td>${row.updated_at}</td>
              <td>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}">Delete</button>
              </td>
            </tr>`;
        });

        // Attach delete event
        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this assignment?')) {
              let id = this.getAttribute('data-id');
              let formData = new FormData();
              formData.append('id', id);

              fetch('../php/assignTeacher/delete_teacher.php', {
                method: 'POST',
                body: formData
              })
                .then(res => res.json())
                .then(response => {
                  alert(response.message);
                  loadAssignments();
                });
            }
          });
        });
      });
  }

  loadAssignments();
});
