document.addEventListener('DOMContentLoaded', function () {
  // Select body or a specific container to inject the offcanvas
  const offcanvasContainer = document.querySelector('body');

  // Function to load the offcanvas content
  function loadOffcanvas() {
    fetch('/html/transport_html/transport_driver.html') // Path to the external HTML
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching the HTML: ${response.statusText}`);
        }
        return response.text();
      })
      .then(data => {
        // Inject the loaded HTML into the body
        offcanvasContainer.insertAdjacentHTML('beforeend', data);

        // Initialize tooltips for the newly injected content
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Initialize and show the Bootstrap offcanvas
        const offcanvasElement = document.getElementById('addDriverOffcanvas');
        if (offcanvasElement) {
          const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);

          // Listen for the offcanvas hidden event to clean up
          offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
            document.querySelectorAll('.offcanvas-backdrop').forEach(backdrop => backdrop.remove());
            document.body.style.filter = ''; // Reset any filter
          });

          // Show the offcanvas
          offcanvasInstance.show();
        } else {
          console.error('Offcanvas element not found in the loaded HTML.');
        }
      })
      .catch(error => console.error('Error loading the offcanvas:', error));
  }

  document.querySelectorAll('.btn[data-bs-toggle="offcanvas"]').forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      loadOffcanvas();
    });
  });

  // Add event listener to the "Add Driver" button(s)
  const addDriverButtons = document.querySelectorAll('.btn[data-bs-toggle="offcanvas"]');
  if (addDriverButtons.length > 0) {
    addDriverButtons.forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        loadOffcanvas(); // Load the offcanvas content when the button is clicked
      });
    });
  } else {
    console.error('No "Add Driver" buttons found with data-bs-toggle="offcanvas".');
  }
});
