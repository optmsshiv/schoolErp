// Form submission handling for Hostel
document.addEventListener('submit', function (event) {
  if (event.target && event.target.id === 'hostelForm') {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form data
    const hostelType = document.getElementById('hostelType').value;
    const hostelName = document.getElementById('hostelName').value;
    const hostelFee = document.getElementById('hostelFee').value;
    const startDate = document.getElementById('joiningDate').value;
    const leaveDate = document.getElementById('leavingDate').value;

    // Validate form data
    if (!hostelType || !hostelName || !hostelFee || !startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out all required fields!'
      });
      return;
    }

    // Get userId from the URL (or any other source you are using)
    const userId = new URLSearchParams(window.location.search).get('user_id');

    // Check if userId is available
    if (!userId) {
      alert('User ID is missing!');
      return;
    }

    // Prepare data for submission
    const formData = {
      hostelType,
      hostelName,
      hostelFee,
      startDate,
      leaveDate,
      userId, // Include userId in the form data
    };

    // Send data to the server
    fetch('/php/hostel/save_hostel.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          // Close the offcanvas first
          const offcanvasElement = bootstrap.Offcanvas.getInstance(document.getElementById('hostelCanvas'));
          offcanvasElement.hide();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message,
            showConfirmButton: true,
          }).then((result) => {
            // Check if the user clicked the "OK" button
            if (result.isConfirmed) {

              // Clear the form
              document.getElementById('hostelForm').reset();

              // Reload the page after clicking OK
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving data.'
        });
      });
  }
});
