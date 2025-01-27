document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded');

  // Load off-canvas HTML dynamically
  fetch('../model/offCanvas.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load offCanvas.html');
      }
      return response.text();
    })
    .then(data => {
      // Insert fetched HTML into the placeholder
      document.getElementById('offcanvasEnd').innerHTML = data;

      // Initialize off-canvas logic after loading HTML
      initializeOffCanvas();
    })
    .catch(error => {
      console.error('Error loading offCanvas.html:', error);
    });

  // Function to initialize off-canvas behavior
  function initializeOffCanvas() {
    var offcanvas = document.getElementById('offcanvasAddUser');
    var form;

    if (offcanvas) {
      offcanvas.addEventListener('shown.bs.offcanvas', function () {
        console.log('Off-canvas shown');

        form = document.getElementById('addNewUser');
        console.log('Form element:', form);

        if (form) {
          console.log('Form found, adding event listener');

          // Add submit event listener to the form
          form.addEventListener('submit', function (event) {
            event.preventDefault();

            var formData = new FormData(this);

            fetch('../php/canvaData.php', {
              method: 'POST',
              body: formData
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                if (data.success) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    position: 'top', // Change position to top
                    toast: true, // Makes the alert appear as a toast
                    text: `New user created successfully with User ID: ${data.userId} and Password: ${data.password}`,
                    confirmButtonText: 'OK'
                  }).then(() => {
                    form.reset();
                    var bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                    bsOffcanvas.hide();
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    position: 'top', // Change position to top
                    toast: true, // Makes the alert appear as a toast
                    title: 'Oops...',
                    text: data.message || 'Something went wrong. Please try again.',
                    confirmButtonText: 'OK'
                  });
                }
              })
              .catch(error => {
                Swal.fire({
                  icon: 'error',
                  position: 'top', // Change position to top
                  toast: true, // Makes the alert appear as a toast
                  title: 'Oops...',
                  text: 'Something went wrong. Please try again.',
                  confirmButtonText: 'OK'
                });
                console.error('Fetch error:', error);
              });
          });
        } else {
          console.error('Form element not found');
        }
      });
    } else {
      console.error('Off-canvas element not found');
    }
  }
});
