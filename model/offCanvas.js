document.addEventListener('DOMContentLoaded', function () {
//  console.log('DOM fully loaded');

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
      document.getElementById('offcanvasAddUser').innerHTML = data;

      // Initialize off-canvas logic after loading HTML
      initializeOffCanvas();
    })
    .catch(error => {
      console.error('Error loading offCanvas.html:', error);
    });

  // Function to initialize off-canvas behavior
  function initializeOffCanvas() {
    var offcanvas = document.getElementById('userAddCanvas');
    var form;

    if (offcanvas) {
      offcanvas.addEventListener('shown.bs.offcanvas', function () {
      //  console.log('Off-canvas shown');

        form = document.getElementById('addNewUser');
      //  console.log('Form element:', form);

        if (form) {
        //  console.log('Form found, adding event listener');

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
                    target: document.getElementById('userAddCanvas'),
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
                    // Refresh the table
                    refreshUserTable();
                  });
                } else {
                  Swal.fire({
                    target: document.getElementById('userAddCanvas'),
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
                  target: document.getElementById('userAddCanvas'),
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

 // Function to refresh the user table
  /**
   * Refreshes the user table by fetching the latest user data from the server
   * and updating the table content.
   */
  function refreshUserTable() {
    fetch('../php/userRole/get_user_role.php') // Replace with the correct endpoint for fetching users
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.text(); // Assuming the response is HTML
      })
      .then(data => {
        // Update the table content
        document.getElementById('userTable').innerHTML = data; // Replace with your table body ID
        console.log('Table refreshed successfully');
      })
      .catch(error => {
        console.error('Error refreshing table:', error);
      });
  }
});
