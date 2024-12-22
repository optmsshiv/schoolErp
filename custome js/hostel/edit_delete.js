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
                            <input type="text" id="editHostelType" class="swal2-input" placeholder="Hostel Type" value="${hostelDetails.hostel_type || ''}">
                            <input type="text" id="editHostelName" class="swal2-input" placeholder="Hostel Name" value="${hostelDetails.hostel_name || ''}">
                            <input type="number" id="editHostelFee" class="swal2-input" placeholder="Hostel Fee" value="${hostelDetails.hostel_fee || ''}">
                            <input type="date" id="editStartDate" class="swal2-input" value="${hostelDetails.start_date || ''}">
                            <input type="date" id="editLeaveDate" class="swal2-input" placeholder="Leave Date (Optional)" value="${hostelDetails.leave_date || ''}">
                        `,
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
