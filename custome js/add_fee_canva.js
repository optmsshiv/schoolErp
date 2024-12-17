fetch('../html/add_fee_canva.html')
.then(response => response.text())
.then(html => {
  document.getElementById('canvas-container').innerHTML = html;
})
.catch(error => console.error('Error loading canvas:', error));
