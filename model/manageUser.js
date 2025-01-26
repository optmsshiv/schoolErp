$(document).ready(function () {
  // Initialize DataTable with the checkbox column and other configurations
  var table = $('#optms').DataTable({
    dom: '<"row"<"col-md-6"l><"col-md-6"B>>' + 't' + '<"row"<"col-md-6"i><"col-md-6"p>>',

    lengthMenu: [
      [5, 10, 15, 25, 50, -1],
      [5, 10, 15, 25, 50, 'All']
    ],
    pagingType: 'full_numbers',
    responsive: true,
    ordering: false, // Disable sorting for all columns
    pageLength: 5,
    language: {
      paginate: {
        first: '<<',
        last: '>>',
        next: '>',
        previous: '<'
      },
      lengthMenu: 'Display _MENU_ records per page',
      info: 'Showing page _PAGE_ of _PAGES_'
    }
  });

  //search box
  $('#searchBox').on('keyup', function () {
    table.search(this.value).draw();
  });

  // Handle 'Select All' checkbox behavior
  $('#select-all').on('click', function () {
    var rows = table.rows({ search: 'applied' }).nodes();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);
  });

  // Handle individual row selection
  $('#optms tbody').on('change', 'input[type="checkbox"]', function () {
    if (!this.checked) {
      var el = $('#select-all').get(0);
      if (el && el.checked && 'indeterminate' in el) {
        el.indeterminate = true;
      }
    }
  });

  // Event handler for custom length dropdown
  $('#customLength').on('change', function () {
    var length = $(this).val();
    table.page.len(length).draw();
  });
});

// Attach click event to custom dropdown export buttons
$('#printBtn').on('click', function () {
  table.button('.buttons-print').trigger(); // Trigger print when clicked
});

// Handle delete button click event
$('#optms').on('click', '.deleteBtn', function () {
  var row = $(this).closest('tr'); // Get the closest row (tr) to the delete button
  var rowData = table.row(row).data(); // Get the row data if needed

  // Optional: Ask for confirmation before deleting
  var confirmDelete = confirm('Are you sure you want to delete this row?');
  if (confirmDelete) {
    // Remove the row from the DataTable
    table.row(row).remove().draw();
  }
});
