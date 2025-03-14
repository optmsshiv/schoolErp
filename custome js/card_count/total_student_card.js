 $(document).ready(function() {
      $.ajax({
        url: '/php/cardPhp/total_student_card.php', // Path to the PHP file
        method: 'GET',
        success: function(response) {
          if (response.total_student !== undefined) {
            $('#total_student').text(response.total_student.toLocaleString()); // Update the total student count
          } else {
            $('#total_student').text('Error');
          }
        },
        error: function() {
          $('#total_student').text('Error');
        }
      });
    });
