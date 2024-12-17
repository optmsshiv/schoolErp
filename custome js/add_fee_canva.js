/*
fetch('../html/add_fee_canvas.html')
.then(response => response.text())
.then(html => {
  document.getElementById('canvas-container').innerHTML = html;
})
.catch(error => console.error('Error loading canvas:', error));*/

fetch('../html/add_fee_canvas.html')
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
