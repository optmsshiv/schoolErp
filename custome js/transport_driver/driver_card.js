 $(document).ready(function() {
      $.ajax({
        url: '/php/driverAdd/driver_card.php', // Path to the PHP file
        method: 'GET',
        success: function(response) {
          if (response.total_drivers !== undefined) {
            $('#total-drivers').text(response.total_drivers.toLocaleString()); // Update the total drivers count
          } else {
            $('#total-drivers').text('Error');
          }
        },
        error: function() {
          $('#total-drivers').text('Error');
        }
      });
    });
