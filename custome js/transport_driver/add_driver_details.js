document.getElementById("addDriverDetails").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Collect form data
  const formData = new FormData(this);

  // Send data to the server
  fetch("/php/driverAdd/add_driver.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert(data.message);
        // Optionally reset the form or close the offcanvas
        document.getElementById("addDriverDetails").reset();
        const offcanvasElement = document.getElementById("addDriverOffcanvas");
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
        offcanvas.hide();
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      alert("An error occurred while saving driver details.");
      console.error(error);
    });
});
