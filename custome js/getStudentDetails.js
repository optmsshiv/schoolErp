document.addEventListener("DOMContentLoaded", () => {
  // Get the user_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("user_id");

  if (userId) {
      // Fetch student data from the backend
      fetch(`getStudent.php?user_id=${userId}`)
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  document.getElementById('student-profile').innerHTML = `
                      <p class="text-danger">${data.error}</p>`;
              } else {
                  // Populate student details
                  document.getElementById('student-profile').innerHTML = `
                      <div class="col-md-4">
                          <p><strong>First Name :</strong> ${data.first_name}</p>
                          <p><strong>App ID :</strong> ${data.app_id}</p>
                          <p><strong>Phone :</strong> ${data.phone}</p>
                          <p><strong>Email :</strong> ${data.email}</p>
                          <p><strong>Aadhar :</strong> ${data.aadhar}</p>
                          <p><strong>Category :</strong> ${data.category}</p>
                      </div>
                      <div class="col-md-4">
                          <p><strong>Last Name :</strong> ${data.last_name}</p>
                          <p><strong>Gender :</strong> ${data.gender}</p>
                          <p><strong>Class :</strong> ${data.class}</p>
                          <p><strong>Religion :</strong> ${data.religion}</p>
                          <p class="badge bg-label-success me-1"><strong>Status :</strong> ${data.status}</p>
                          <p><strong>Handicapped :</strong> ${data.handicapped}</p>
                      </div>
                      <div class="col-md-4">
                          <p><strong>Guardian :</strong> ${data.guardian}</p>
                          <p><strong>Biometric ID :</strong> ${data.biometric_id}</p>
                          <p><strong>DOB :</strong> ${data.dob}</p>
                          <p><strong>Admission Date :</strong> ${data.admission_date}</p>
                          <p><strong>Sr No. :</strong> ${data.sr_no}</p>
                      </div>`;
              }
          })
          .catch(error => console.error("Error fetching student data:", error));
  } else {
      document.getElementById('student-profile').innerHTML = `
          <p class="text-danger">No student selected. Please go back and select a student.</p>`;
  }
});
