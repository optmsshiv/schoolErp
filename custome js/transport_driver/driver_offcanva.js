  document.addEventListener('DOMContentLoaded', function() {
    // Select body or a specific div to inject the offcanvas
    const offcanvasContainer = document.querySelector('body');

    // Function to load the offcanvas content
    function loadOffcanvas() {
      fetch('/html/transport_html/transport_driver.html')  // Path to the external HTML
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(data => {
          // Inject the loaded HTML into the body or a specific container
          offcanvasContainer.insertAdjacentHTML('beforeend', data);

          // Initialize the Bootstrap offcanvas after it's injected
          const offcanvasElement = document.getElementById('addDriverOffcanvas');

          // Check if the offcanvas was successfully injected
          if (offcanvasElement) {
            const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
            offcanvas.show();
          } else {
            console.error('Offcanvas element not found');
          }
        })
        .catch(error => console.error('Error loading the offcanvas:', error));
    }

    // Add event listener to the "Add Driver" button to trigger the load
    document.querySelector('.btn[data-bs-toggle="offcanvas"]').addEventListener('click', function(event) {
      event.preventDefault();
      loadOffcanvas();  // Load the offcanvas content when the button is clicked
    });
  });
