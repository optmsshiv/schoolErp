document.getElementById('loadOffcanvas').addEventListener('click', function () {
    fetch('/html/hostel_canva.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('offcanvasContainer').innerHTML = html;
            // Trigger the offcanvas
            const offcanvasElement = new bootstrap.Offcanvas(document.getElementById('hostelCanvas'));
            offcanvasElement.show();
        })
        .catch(error => console.error('Error loading offcanvas:', error));
});
