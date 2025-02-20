$(document).ready(function () {
  $.ajax({
    url: '/php/cardPhp/total_active_user.php', // Path to the PHP file
    method: 'GET',
    success: function (response) {
      if (response.total_users !== undefined) {
        $('#total_users').text(response.total_users.toLocaleString()); // Update the total student count
      } else {
        $('#total_users').text('Error');
      }
    },
    error: function () {
      $('#total_users').text('Error');
    }
  });
});
