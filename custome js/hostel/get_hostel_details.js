document.addEventListener('DOMContentLoaded', function () {
  const userId = new URLSearchParams(window.location.search).get('user_id'); // Extract user_id from the URL

    // Fetch hostel details when the page loads
    fetch('/php/hostel/fetch_hostel_detail.php',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify({ userId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const tableBody = document.querySelector('#hostelTable tbody');
                tableBody.innerHTML = ''; // Clear any existing rows

                // Loop through the data and insert rows
                data.data.forEach((row) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <tr>
                            <td>${item.student_id || 'N/A'}</td>
                            <td>${item.student_name || 'N/A'}</td>
                            <td>${item.hostel_name || 'N/A'}</td>
                            <td>${item.hostel_fee || 'N/A'}</td>
                            <td>${item.start_date || 'N/A'}</td>
                            <td>${item.leave_date || 'N/A'}</td>
                            <td>
                                <button class="btn btn-sm btn-danger">Remove</button>
                            </td>
                        </tr>
                    `;
                    tableBody.appendChild(tr);
                });
            } else {
                alert(data.message); // Show error message

            }
        })
        .catch(error => {
            console.error('Error fetching data:', data.message);
            console.error('Error:', error);
            alert('An error occurred while fetching hostel details.');
        });
});
