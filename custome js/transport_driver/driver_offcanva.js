document.addEventListener("DOMContentLoaded", function () {
  // Dynamically load offcanvas content
  fetch("/html/transport_html/transport_driver.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("offcanvasDriver").innerHTML = data;

      // Attach the event listener after loading the content
      const form = document.getElementById("addDriverDetails");
      if (form) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          console.log("Form submitted!");

          // AJAX logic to submit form data
          const formData = new FormData(form);
          fetch("/php/driverAdd/add_driver.php", {
            method: "POST",
            body: formData,
          })
            .then(response => response.json())
            .then(result => {
              console.log(result);
              if (result.status === "success") {
                alert("Driver added successfully!");
                form.reset(); // Reset the form
                const offcanvas = bootstrap.Offcanvas.getInstance(
                  document.getElementById("addDriverOffcanvas")
                );
                offcanvas.hide(); // Close the offcanvas
              } else {
                alert("Error: " + result.message);
              }
            })
            .catch(error => {
              console.error("Error:", error);
              alert("An unexpected error occurred.");
            });
        });
      } else {
        console.error("Form with ID 'addDriverDetails' not found.");
      }
    });
});



