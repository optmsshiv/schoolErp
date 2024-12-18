// Form submission handling for Hostel
document.addEventListener('submit', function (event) {
    if (event.target && event.target.id === 'hostelForm') {
        event.preventDefault(); // Prevent default form submission

        // Retrieve form data
        const hostelType = document.getElementById('hostelType').value;
        const hostelName = document.getElementById('hostelName').value;
        const hostelFee = document.getElementById('hostelFee').value;
        const startDate = document.getElementById('joiningDate').value;
        const leaveDate = document.getElementById('leavingDate').value;

        // Validate form data
        if (!hostelType || !hostelName || !hostelFee || !startDate) {
            alert('Please fill out all fields!');
            return;
        }

        // Prepare data for submission
        const formData = {
            hostelType,
            hostelName,
            hostelFee,
            startDate,
            leaveDate,
        };

        // Send data to the server
        fetch('/php/hostel/save_hostel.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert(data.message);
                    // Close the offcanvas
                    const offcanvasElement = bootstrap.Offcanvas.getInstance(document.getElementById('hostelCanvas'));
                    offcanvasElement.hide();

                    // Clear the form
                    document.getElementById('hostelForm').reset();
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while saving data.');
            });
    }
});
