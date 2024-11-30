document.addEventListener("DOMContentLoaded", () => {
  // Get the user_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("user_id");

  if (userId) {
      // Show a loading message
      document.querySelector("#student-info").innerHTML = `<p class="text-info">Loading student details...</p>`;

      // Fetch student data from the backend
      fetch(`../php/studentInfo/getStudentDetails.php?user_id=${userId}`)
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  // Display error message
                  document.querySelector("#student-info").innerHTML = `
                    <p class="text-danger">${data.error}</p>`;
              } else {
                  // Populate the table with fetched data
                  document.querySelector("#student-info").innerHTML = `
                    <div class="border p-3 mb-2 mt-5 position-relative">
                      <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Student Profile</h5>
                      <div class="d-flex justify-content-end mb-3">
                        <button class="btn btn-primary btn-sm">Edit</button>
                      </div>
                      <table class="table table-borderless">
                        <thead>
                          <tr class="table-info">
                            <th style="width: 3%;"></th>
                            <th></th>
                            <th></th>
                            <th style="width: 3%;"></th>
                            <th></th>
                            <th></th>
                            <th style="width: 3%;"></th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>First Name</strong></td>
                            <td>:</td>
                            <td>${data.first_name}</td>
                            <td><strong>Last Name</strong></td>
                            <td>:</td>
                            <td>${data.last_name}</td>
                            <td><strong>App ID</strong></td>
                            <td>:</td>
                            <td>${data.user_id}</td>
                          </tr>
                          <tr>
                            <td><strong>Phone</strong></td>
                            <td>:</td>
                            <td>${data.phone}</td>
                            <td><strong>Email</strong></td>
                            <td>:</td>
                            <td>${data.email}</td>
                            <td><strong>Aadhar</strong></td>
                            <td>:</td>
                            <td>${data.aadhar_no}</td>
                          </tr>
                          <tr>
                            <td><strong>Category</strong></td>
                            <td>:</td>
                            <td>${data.category}</td>
                            <td><strong>Gender</strong></td>
                            <td>:</td>
                            <td>${data.gender}</td>
                            <td><strong>Class</strong></td>
                            <td>:</td>
                            <td>${data.class_name}</td>
                          </tr>
                          <tr>
                            <td><strong>Religion</strong></td>
                            <td>:</td>
                            <td>${data.religion}</td>
                            <td><strong>Status</strong></td>
                            <td>:</td>
                            <td><span class="badge bg-label-success">${data.status || 'Active'}</span></td>
                            <td><strong>Handicapped</strong></td>
                            <td>:</td>
                            <td>${data.handicapped ? 'Yes' : 'No'}</td>
                          </tr>
                          <tr>
                            <td><strong>Guardian</strong></td>
                            <td>:</td>
                            <td>${data.guardian}</td>
                            <td><strong>Biometric ID</strong></td>
                            <td>:</td>
                            <td>${data.pen_no}</td>
                            <td><strong>DOB</strong></td>
                            <td>:</td>
                            <td>${data.date_of_birth}</td>
                          </tr>
                          <tr>
                            <td><strong>Admission Date</strong></td>
                            <td>:</td>
                            <td>${data.admission_date}</td>
                            <td><strong>Sr No.</strong></td>
                            <td>:</td>
                            <td>${data.sr_no}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>`;
              }
          })
          .catch(error => {
              console.error("Error fetching student data:", error);
              document.querySelector("#student-info").innerHTML = `
                <p class="text-danger">An error occurred while fetching student details. Please try again later.</p>`;
          });
  } else {
      // Display error for missing user_id
      document.querySelector("#student-info").innerHTML = `
        <p class="text-danger">No student selected. Please go back and select a student in Active Students.</p>`;
  }
});
