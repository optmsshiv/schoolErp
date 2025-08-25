document.addEventListener("DOMContentLoaded", function () {
  // Load dropdowns
  fetch("../php/assignTeacher/assign_class_teacher.php")
    .then(res => res.json())
    .then(data => {
      let classSelect = document.getElementById("classTeachers");
      let teacherSelect = document.getElementById("teacherName");

      data.classes.forEach(c => {
        classSelect.innerHTML += `<option value="${c.id}">${c.class_name}</option>`;
      });

      data.teachers.forEach(t => {
        teacherSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
      });
    });

  // Handle form submit
  document.getElementById("classTeacherForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);

    fetch("../php/assignTeacher/fetch_teacher_class.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        loadAssignments(); // refresh table
      });
  });

  // Load existing assignments
  function loadAssignments() {
    fetch("../php/assignTeacher/fetch_assignments.php")
      .then(res => res.json())
      .then(data => {
        let tbody = document.getElementById("assignedTeacher");
        tbody.innerHTML = "";
        data.forEach((row, index) => {
          tbody.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${row.class_name}</td>
              <td>${row.teacher_name}</td>
              <td>${row.assigned_date}</td>
              <td>${row.updated_at}</td>
              <td>
                <button class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>`;
        });
      });
  }

  loadAssignments();
});
