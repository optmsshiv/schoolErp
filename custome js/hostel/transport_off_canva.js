document.getElementById('loadOffcanvasTrans').addEventListener('click', function () {
    fetch('/html/transport_canva.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('offcanvasContainerTransport').innerHTML = html;
            // Trigger the offcanvas
            const offcanvasElement = new bootstrap.Offcanvas(document.getElementById('transportCanvas'));
            offcanvasElement.show();
        })
        .catch(error => console.error('Error loading offcanvas:', error));
});
