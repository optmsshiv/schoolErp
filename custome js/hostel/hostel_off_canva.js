document.getElementById('loadOffcanvas').addEventListener('click', function () {
    // Get the user_id from the URL
    const userId = new URLSearchParams(window.location.search).get('user_id');

    // Dynamically load offcanvas content if needed
    fetch('/html/hostel_canva.html')
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById('offcanvasContainerHostel');
            container.innerHTML = html;

            // Pre-fill the hidden input field with the user_id
            const hiddenInput = container.querySelector('#studentIdInput');
            if (hiddenInput) {
                hiddenInput.value = userId;
            }
             // Set the readonly input field with the user_id
            const userIdInput = container.querySelector('#userIdInput');
            if (userIdInput) {
                userIdInput.value = userId;
            }

            // Initialize offcanvas only after it's in the DOM
            const offcanvasElement = document.getElementById('hostelCanvas');
            const bootstrapOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
            bootstrapOffcanvas.show();
        })
        .catch(error => console.error('Error loading offcanvas:', error));
});
