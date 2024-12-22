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
        data.forEach((student) => {
          const startDateFormatted = formatDate(student.start_date);
          const leaveDateFormatted = student.leave_date ? formatDate(student.leave_date) : 'N/A';
          const tr = document.createElement('tr');
          tr.innerHTML = `
                        <tr>
                            <td>${student.student_id}</td>
            <td>${student.first_name} ${student.last_name}</td>
            <td>${student.hostel_name}</td>
            <td>${student.hostel_fee}</td>
            <td>${startDateFormatted}</td>
            <td>${leaveDateFormatted}</td>
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
