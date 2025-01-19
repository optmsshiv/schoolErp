// Use Fetch API to load external HTML and inject into the page
document.addEventListener('DOMContentLoaded', function() {
  const offcanvasContainer = document.querySelector('body');  // Select body or a specific div to inject the offcanvas

  // Function to load the offcanvas content
  function loadOffcanvas() {
    fetch('/html/transport_html/transport_canva.html')  // Path to the external HTML
      .then(response => response.text())
      .then(data => {
        // Inject the loaded HTML into the body or a specific container
        offcanvasContainer.insertAdjacentHTML('beforeend', data);

        // Now that the offcanvas is loaded, initialize the Bootstrap offcanvas
        const offcanvas = new bootstrap.Offcanvas(document.getElementById('addDriverOffcanvas'));
        offcanvas.show();
      })
      .catch(error => console.error('Error loading the offcanvas:', error));
  }

  // Add event listener to the "Add Driver" button to trigger the load
  document.querySelector('.btn[data-bs-toggle="offcanvas"]').addEventListener('click', function(event) {
    event.preventDefault();
    loadOffcanvas();  // Load the offcanvas content when the button is clicked
  });
});
