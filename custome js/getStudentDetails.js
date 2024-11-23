document.addEventListener("DOMContentLoaded", () => {
  // Get the user_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("user_id");

  const studentProfileElement = document.getElementById('student-profile');

  if (userId) {
      // Show a loading message while fetching student details
      studentProfileElement.innerHTML = `<p class="text-info">Loading student details...</p>`;

      // Fetch student data from the backend
      fetch(`./getStudentDetails.php?user_id=${userId}`)
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  // Display error message
                  studentProfileElement.innerHTML = `
                      <p class="text-danger">${data.error}</p>`;
              } else if (data.table !== "student_master") {
                  // Display error for fetching data from the wrong table
                  studentProfileElement.innerHTML = `
                      <p class="text-danger">Data is not fetched from the student_master table.</p>`;
              } else {
                  // Populate student details
                  studentProfileElement.innerHTML = `
                      <div class="col-md-4">
                          <p><strong>First Name :</strong> ${data.first_name}</p>
                          <p><strong>App ID :</strong> ${data.id}</p>
                          <p><strong>Phone :</strong> ${data.phone}</p>
                          <p><strong>Email :</strong> ${data.email}</p>
                          <p><strong>Aadhar :</strong> ${data.aadhar_no}</p>
                          <p><strong>Category :</strong> ${data.category}</p>
                      </div>
                      <div class="col-md-4">
                          <p><strong>Last Name :</strong> ${data.last_name}</p>
                          <p><strong>Gender :</strong> ${data.gender}</p>
                          <p><strong>Class :</strong> ${data.class_name}</p>
                          <p><strong>Religion :</strong> ${data.religion}</p>
                          <p class="badge bg-label-success me-1"><strong>Status :</strong> Active</p>
                          <p><strong>Handicapped :</strong> ${data.handicapped ? 'Yes' : 'No'}</p>
                      </div>
                      <div class="col-md-4">
                          <p><strong>Guardian :</strong> ${data.guardian}</p>
                          <p><strong>Biometric ID :</strong> ${data.pen_no}</p>
                          <p><strong>DOB :</strong> ${data.date_of_birth}</p>
                          <p><strong>Admission Date :</strong> ${data.admission_date}</p>
                          <p><strong>Sr No. :</strong> ${data.sr_no}</p>
                      </div>`;
              }
          })
          .catch(error => {
              // Handle fetch errors
              console.error("Error fetching student data:", error);
              studentProfileElement.innerHTML = `
                  <p class="text-danger">An error occurred while fetching student details. Please try again later.</p>`;
          });
  } else {
      // Display error for missing user_id
      studentProfileElement.innerHTML = `
          <p class="text-danger">No student selected. Please go back and select a student.</p>`;
  }
});

