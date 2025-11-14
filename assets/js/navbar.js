// Load common navbar
function loadNavbar() {
  fetch("../html/components/navbar.html")
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);
      setupNavbar();
    });
}

function setupNavbar() {
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("role");

  if (!username || !role) {
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'You are not authorized to view this page.',
      confirmButtonText: 'Go to Login'
    }).then(() => {
      window.location.href = 'login.html';
    });
    return;
  }

  document.getElementById("navUsername").textContent = username + " (" + role + ")";

  const navLinks = document.querySelector(".nav-links");

  // Add role-specific menu items
  if (role === "teacher") {
    navLinks.insertAdjacentHTML("beforeend", `
      <li><a href="/html/teacher-dashboard.html">📋 Attendance</a></li>
      <li><a href="#">📚 Assignments</a></li>
      <li><a href="#">🗓 Timetable</a></li>
    `);
  } else if (role === "accountant") {
    navLinks.insertAdjacentHTML("beforeend", `
      <li><a href="/html/accountant-dashboard.html">💰 Fee Collection</a></li>
      <li><a href="#">📊 Reports</a></li>
      <li><a href="#">🔔 Dues</a></li>
    `);
  }

  // Logout function defined globally
  window.logout = function() {
    sessionStorage.clear();
    window.location.href = "login.html";
  };
}

// Initialize navbar on page load
document.addEventListener("DOMContentLoaded", loadNavbar);
