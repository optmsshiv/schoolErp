document.addEventListener('click', function (event) {
    // Handle Edit button
    if (event.target.classList.contains('edit-hostel')) {
        const userId = event.target.dataset.userId;

        // Show Swal form for editing hostel details
        Swal.fire({
            title: 'Edit Hostel Details',
            html: `
                <label for="editHostelName">Hostel Name:</label>
              <input id="editHostelName" class="swal2-input" value="${hostelDetails.hostel_name || ''}">

              <label for="editHostelType">Hostel Type:</label>
              <input id="editHostelType" class="swal2-input" value="${hostelDetails.hostel_type || ''}">

              <label for="editHostelFee">Hostel Fee:</label>
              <input id="editHostelFee" class="swal2-input" type="number" value="${hostelDetails.hostel_fee || ''}">

              <label for="editStartDate">Start Date:</label>
              <input id="editStartDate" class="swal2-input" type="date" value="${hostelDetails.start_date || ''}">

              <label for="editLeaveDate">Leave Date:</label>
              <input id="editLeaveDate" class="swal2-input" type="date" value="${hostelDetails.leave_date || ''}">
            `,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            preConfirm: () => {
                return {
                     hostelName: document.getElementById('editHostelName').value,
                hostelType: document.getElementById('editHostelType').value,
                hostelFee: document.getElementById('editHostelFee').value,
                startDate: document.getElementById('editStartDate').value,
                leaveDate: document.getElementById('editLeaveDate').value,
                userId: userId, // Include the userId for the update
                };

                // Return the edited details for further processing
              return editedDetails;
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
