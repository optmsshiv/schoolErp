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
                //alert("Driver added successfully!");
                // SweetAlert2 success modal with driver's name
                Swal.fire({
                  title: "Driver Added!",
                  text: `Driver ${formData.get("driver_name")} has been added successfully.`,
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(() => {
                form.reset(); // Reset the form
                const offcanvas = bootstrap.Offcanvas.getInstance(
                  document.getElementById("addDriverOffcanvas")
                );
                offcanvas.hide(); // Close the offcanvas
              });
              } else {
                Swal.fire({
                  title: "Error!",
                  text: result.message,
                  icon: "error",
                  confirmButtonText: "OK",
                });
              }
            })
            .catch(error => {
              console.error("Error:", error);
              // SweetAlert2 error modal for unexpected errors
              Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred. Please try again later.",
                icon: "error",
                confirmButtonText: "OK",
              });
            });
        });
      } else {
        console.error("Form with ID 'addDriverDetails' not found.");
      }
    });
});



