document.addEventListener('click', function (event) {
    // Handle Edit button
    if (event.target.classList.contains('edit-hostel')) {
        const userId = event.target.dataset.userId;

        // Fetch current hostel details to populate the form
        fetch('/php/hostel/fetch_hostel_detail.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    const hostelDetails = data.data;

                    // Show Swal form with prefilled data
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
                            // Return updated details
                            return {
                                hostelType: document.getElementById('editHostelType').value.trim(),
                                hostelName: document.getElementById('editHostelName').value.trim(),
                                hostelFee: parseFloat(document.getElementById('editHostelFee').value),
                                startDate: document.getElementById('editStartDate').value,
                                leaveDate: document.getElementById('editLeaveDate').value || null, // Handle optional leave date
                            };
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const { hostelType, hostelName, hostelFee, startDate, leaveDate } = result.value;

                            // Validate inputs
                            if (!hostelType || !hostelName || !hostelFee || !startDate) {
                                Swal.fire('Error', 'All fields except Leave Date are required!', 'error');
                                return;
                            }

                            // Send updated data to backend
                            fetch('/php/hostel/edit_hostel.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId,
                                    hostelType,
                                    hostelName,
                                    hostelFee,
                                    startDate,
                                    leaveDate,
                                }),
                            })
                                .then((response) => response.json())
                                .then((updateData) => {
                                    if (updateData.status === 'success') {
                                        Swal.fire('Success', updateData.message, 'success').then(() => {
                                            // Reload the table or refresh UI
                                            location.reload();
                                        });
                                    } else {
                                        Swal.fire('Error', updateData.message, 'error');
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                    Swal.fire('Error', 'Failed to update hostel details.', 'error');
                                });
                        }
                    });
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire('Error', 'Failed to fetch hostel details.', 'error');
            });
    }

    // Handle Remove button
    if (event.target.classList.contains('remove-hostel')) {
        const userId = event.target.dataset.userId;

        Swal.fire({
            title: 'Are you sure?',
            text: 'This will remove the hostel assignment for the student.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Send delete request to backend
                fetch('/php/hostel/delete_hostel.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === 'success') {
                            Swal.fire('Success', data.message, 'success').then(() => {
                                // Reload the table or refresh UI
                                location.reload();
                            });
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
