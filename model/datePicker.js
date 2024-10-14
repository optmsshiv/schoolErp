$(function() {
  $('#bs-datepicker-daterange').datepicker({
    format: 'dd/mm/yyyy',
    autoclose: true,
    todayHighlight: true
  }).on('changeDate', function(e) {
    // Highlight the range
    var startDate = $('#bs-datepicker-daterange input').first().datepicker('getDate');
    var endDate = $('#bs-datepicker-daterange input').last().datepicker('getDate');
    if (startDate && endDate) {
        var currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            $('.datepicker-days td.day').filter(function() {
                return $(this).text() == currentDate.getDate();
            }).addClass('range');
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
  });
});
