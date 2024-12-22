document.addEventListener('click', function (event) {
    // Handle Edit button
    if (event.target.classList.contains('edit-hostel')) {
        const userId = event.target.dataset.userId;

        // Show Swal form for editing hostel details
        Swal.fire({
            title: 'Edit Hostel Details',
            html: `
                <input type="text" id="editHostelType" class="swal2-input" placeholder="Hostel Type">
                <input type="text" id="editHostelName" class="swal2-input" placeholder="Hostel Name">
                <input type="number" id="editHostelFee" class="swal2-input" placeholder="Hostel Fee">
                <input type="date" id="editStartDate" class="swal2-input">
                <input type="date" id="editLeaveDate" class="swal2-input" placeholder="Leave Date (Optional)">
            `,
            confirmButtonText: 'Save Changes',
            preConfirm: () => {
                return {
                    hostelType: document.getElementById('editHostelType').value,
                    hostelName: document.getElementById('editHostelName').value,
                    hostelFee: document.getElementById('editHostelFee').value,
                    startDate: document.getElementById('editStartDate').value,
                    leaveDate: document.getElementById('editLeaveDate').value
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { hostelType, hostelName, hostelFee, startDate, leaveDate } = result.value;

                // Send edit request to the backend
                fetch('/php/hostel/edit_hostel.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId,
                        hostelType,
                        hostelName,
                        hostelFee,
                        startDate,
                        leaveDate
                    })
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === 'success') {
                            Swal.fire('Success', data.message, 'success');
                            // Refresh the table or update UI
                        } else {
                            Swal.fire('Error', data.message, 'error');
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Failed to update hostel details.', 'error');
                    });
            }
        });
    }

    // Handle Remove button
    if (event.target.classList.contains('remove-hostel')) {
        const userId = event.target.dataset.userId;

        Swal.fire({
            title: 'Are you sure?',
            text: "This will remove the hostel assignment for the student.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Send delete request to the backend
                fetch('/php/hostel/delete_hostel.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === 'success') {
                            Swal.fire('Success', data.message, 'success');
                            // Refresh the table or update UI
                        } else {
                            Swal.fire('Error', data.message, 'error');
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Failed to remove hostel.', 'error');
                    });
            }
        });
    }
});
