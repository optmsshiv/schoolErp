function updatePaginationControls() {
  const maxVisiblePages = 5;
  const paginationContainer = $('#pagination-numbers');
  paginationContainer.empty();

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add first page button
  if (startPage > 1) {
    paginationContainer.append(`
      <button class="btn btn-sm btn-outline-secondary page-number" data-page="1">1</button>
      ${startPage > 2 ? '<span class="mx-2">...</span>' : ''}
    `);
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.append(`
      <button class="btn btn-sm ${currentPage === i ? 'btn-primary' : 'btn-outline-secondary'} page-number mx-1"
        data-page="${i}">${i}</button>
    `);
  }

  // Add last page button
  if (endPage < totalPages) {
    paginationContainer.append(`
      ${endPage < totalPages - 1 ? '<span class="mx-2">...</span>' : ''}
      <button class="btn btn-sm btn-outline-secondary page-number" data-page="${totalPages}">${totalPages}</button>
    `);
  }
}

// Update the success callback in fetchStudents
success: function(data) {
  totalRecords = data.totalRecords;
  totalPages = Math.ceil(totalRecords / recordsPerPage);
  $('#total-pages').text(totalPages);

  // ... existing table population code ...

  updatePaginationControls();
},

// Add new event listener for page number clicks
$(document).on('click', '.page-number', function() {
  currentPage = parseInt($(this).data('page'));
  fetchStudents($('#search-bar').val());
}); 
