document.addEventListener('DOMContentLoaded', function () {
    // Fetch hostel details when the page loads
    fetch('/php/getHostelDetails/fetch_hostel_student.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const tableBody = document.querySelector('#hostelTable tbody');
                tableBody.innerHTML = ''; // Clear any existing rows

                // Loop through the data and insert rows
                data.data.forEach(item => {
                    const row = `
                        <tr>
                            <td>${item.student_id || 'N/A'}</td>
                            <td>${item.student_name || 'N/A'}</td>
                            <td>${item.hostel_name || 'N/A'}</td>
                            <td>${item.hostel_fee || 'N/A'}</td>
                            <td>${item.start_date || 'N/A'}</td>
                            <td>${item.leave_date || 'N/A'}</td>
                            <td>
                                <button class="btn btn-primary btn-sm view-student" data-user-id="${item.student_id}">View</button>
                            </td>
                        </tr>
                    `;
                    tableBody.insertAdjacentHTML('beforeend', row);
                });
            } else {
                console.error('Error fetching data:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
