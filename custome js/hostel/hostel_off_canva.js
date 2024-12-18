document.getElementById('loadHostelOffcanvas').addEventListener('click', function () {
    // Dynamically load offcanvas content if needed
    fetch('offcanvas-hostel.html')
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById('offcanvasContainer');
            container.innerHTML = html;

            // Initialize offcanvas only after it's in the DOM
            const offcanvasElement = document.getElementById('hostelCanvas');
            const bootstrapOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
            bootstrapOffcanvas.show();
        })
        .catch(error => console.error('Error loading offcanvas:', error));
});
