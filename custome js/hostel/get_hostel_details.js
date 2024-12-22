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

        function formatDate(dateString) {
          if (!dateString) return ''; // Handle null or empty dates
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        }
        // When populating the table rows:
        data.data.forEach((row) => {
          const startDateFormatted = formatDate(student.start_date);
          const leaveDateFormatted = student.leave_date ? formatDate(student.leave_date) : 'N/A';
          const tr = document.createElement('tr');
          tr.innerHTML = `
                        <tr>
                            <td>${row.student_id || 'N/A'}</td>
                            <td>${row.student_name || 'N/A'}</td>
                            <td>${row.hostel_name || 'N/A'}</td>
                            <td>${row.hostel_fee || 'N/A'}</td>
                            <td>${row.startDateFormatted || 'N/A'}</td>
                            <td>${row.leave_date || 'N/A'}</td>
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
      console.error('Error:', error);
      alert('An error occurred while fetching hostel details.');
    });
});
