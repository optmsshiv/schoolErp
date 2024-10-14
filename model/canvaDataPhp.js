window.onload = function() {
    console.log('Window fully loaded');

    var offcanvas = document.getElementById('offcanvasEnd');
    var form;

    if (offcanvas) {
        offcanvas.addEventListener('shown.bs.offcanvas', function() {
            console.log('Off-canvas shown');
            form = document.getElementById('addNewUser');
            console.log('Form element:', form);

            if (form) {
                console.log('Form found, adding event listener');
                form.addEventListener('submit', function(event) {
                    event.preventDefault();

                    var formData = new FormData(this);

                    fetch('../php/canvaData.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: `New user created successfully with User ID: ${data.userId} and Password: ${data.password}`,
                                confirmButtonText: 'OK'
                            }).then(() => {
                                form.reset();
                                var bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                                bsOffcanvas.hide();
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: data.message || 'Something went wrong. Please try again.',
                                confirmButtonText: 'OK'
                            });
                        }
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong. Please try again.',
                            confirmButtonText: 'OK'
                        });
                    });
                });
            } else {
                console.error('Form element not found');
            }
        });
    } else {
        console.error('Off-canvas element not found');
    }
};
