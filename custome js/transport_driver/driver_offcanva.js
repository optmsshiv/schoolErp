document.addEventListener("DOMContentLoaded", function () {
  // Load offcanvas content dynamically
  fetch("/html/transport_html/transport_driver.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("offcanvasDriver").innerHTML = data;
    });

  // Handle form submission
  document.getElementById("addDriverDetails").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Gather form data
    const formData = new FormData(this);

    // Send data via AJAX
    fetch("/php/driverAdd/add_driver.php", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert("Driver added successfully!");
          // Optionally, reset the form
          this.reset();
          // Close the offcanvas
          const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('addDriverOffcanvas'));
          offcanvas.hide();
        } else {
          alert("Error: " + result.message);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
      });
  });
});
