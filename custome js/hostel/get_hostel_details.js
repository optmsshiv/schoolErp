document.addEventListener('DOMContentLoaded', function () {
  const userId = new URLSearchParams(window.location.search).get('user_id'); // Extract user_id from the URL

  // Fetch hostel details when the page loads
  fetch('/php/hostel/fetch_hostel_detail.php', {
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

        // When populating the table rows:
        data.data.forEach((row) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
                        <tr>
                            <td>${row.student_id || 'N/A'}</td>
                            <td>${row.student_name || 'N/A'}</td>
                            <td>${row.hostel_name || 'N/A'}</td>
                            <td>${row.hostel_type || 'N/A'}</td>
                            <td>${row.hostel_fee || 'N/A'}</td>
                            <td>${row.start_date || 'N/A'}</td>
                            <td>${row.leave_date || 'N/A'}</td>
                            <td>
                              <button class="btn btn-warning btn-sm edit-hostel" data-user-id="${student.user_id}">Edit</button>
                              <button class="btn btn-danger btn-sm remove-hostel" data-user-id="${student.user_id}">Remove</button>
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
      console.error('Error:', error);
      alert('An error occurred while fetching hostel details.');
    });
});
