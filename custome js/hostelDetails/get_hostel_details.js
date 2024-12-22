document.addEventListener('DOMContentLoaded', function () {
  // Fetch hostel details when the page loads
  fetch('/php/getHostelDetails/fetch_hostel_student.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const tableBody = document.querySelector('#hostelTable tbody');
        tableBody.innerHTML = ''; // Clear any existing rows

         // Display total number of students
            document.getElementById('totalStudents').innerText = `Total Students: ${data.total_students}`;

        // Assuming 'data' contains the rows of student data
        let serialNumber = 1;
        
        // Loop through the data and insert rows
        data.data.forEach(item => {
          const row = `
                        <tr>
                            <td>${serialNumber}</td> <!-- Serial number column -->
                            <td style="display:none;">${item.student_id || 'N/A'}</td> <!-- Hidden Student ID column -->
                            <td>${item.student_name || 'N/A'}</td>
                            <td>${item.father_name || 'N/A'}</td>
                            <td>${item.mobile_number || 'N/A'}</td>
                            <td>${item.hostel_name || 'N/A'}</td>
                            <td>${item.hostel_fee || 'N/A'}</td>
                            <td>${item.start_date || 'N/A'}</td>
                            <td>${item.leave_date || 'N/A'}</td>
                        </tr>
                    `;
          tableBody.insertAdjacentHTML('beforeend', row);

           // Increment the serial number for the next row
             serialNumber++;
        });
      } else {
        console.error('Error fetching data:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

/*
// Add event listener for the "View" button click
document.querySelectorAll('.view-student').forEach(button => {
    button.addEventListener('click', (e) => {
        const userId = e.target.getAttribute('data-user-id');
        console.log('Student ID:', userId); // Access the student ID from the button's data attribute
        // You can use this ID to perform actions like viewing the student details.
    });
});
<td>
   <button class="btn btn-primary btn-sm view-student" data-user-id="${item.student_id}">View</button>
</td>
*/
