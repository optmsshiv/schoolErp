document.addEventListener("DOMContentLoaded", function() {
  fetch("../html/add_fee_canvas.html")
      .then(response => {
          if (!response.ok) throw new Error('HTML Load Failed');
          return response.text();
      })
      .then(response => {
    const sanitizedHTML = sanitizedHTML(response); // A function to sanitize your HTML (if needed)
    document.getElementById('canvas-container').innerHTML = sanitizedHTML;
})
      .catch(error => {
          console.error('Error loading canvas:', error);
          Swal.fire('Error', 'Failed to load the fee canvas. Please try again.', 'error');
      });
});
