// Function to initialize dark mode based on user preference
function initializeDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');

  if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    toggle.checked = false;
  }
}

// Function to handle the dark mode toggle
function setupDarkModeToggle() {
  const toggle = document.getElementById('dark-mode-toggle');

  toggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('dark-mode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('dark-mode', 'disabled');
    }
  });
}

// Function to toggle password visibility
function setupPasswordToggle() {
  const passwordInput = document.querySelector('.input-group input[type="password"]');
  const togglePassword = document.querySelector('.toggle-password');

  togglePassword.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePassword.textContent = '🙈'; // Change icon to indicate visibility
    } else {
      passwordInput.type = 'password';
      togglePassword.textContent = '👁️'; // Change icon to indicate hidden
    }
  });
}

// Function to initialize form validation
function initializeFormValidation() {
  const form = document.querySelector("form");

  form.addEventListener("submit", function(event) {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Check if either field is empty
    if (username === "" || password === "") {
      // Prevent form submission
      event.preventDefault();

      // Show a prompt or alert to the user
      alert("Both fields are required. Please enter your email/username and password.");
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeDarkMode();
  setupDarkModeToggle();
  setupPasswordToggle();
  initializeFormValidation(); // Add this line to initialize form validation
});
