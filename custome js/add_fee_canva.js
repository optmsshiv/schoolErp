/*
document.addEventListener("DOMContentLoaded", function() {
  fetch("/html/add_fee_canvas.html")
      .then(response => response.text())
      .then(data => {
          document.getElementById('canvas-container').innerHTML = data;
      });
});

*/

document.addEventListener("DOMContentLoaded", function () {
    // Show a loading spinner
    document.getElementById('canvas-container').innerHTML = '<div class="text-center my-4"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';

    // Fetch and load the offcanvas HTML
    fetch("../html/add_fee_canvas.html")
        .then(response => {
            if (!response.ok) throw new Error('HTML Load Failed');
            return response.text();
        })
        .then(html => {
            document.getElementById('canvas-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading canvas:', error);
            Swal.fire('Error', 'Failed to load the fee canvas. Please try again.', 'error');
        });
});


