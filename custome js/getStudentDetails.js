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
                  document.querySelector("#student-info").innerHTML = `<p class="text-danger">${data.error}</p>`;
              } else {
                  // Populate the HTML with fetched data in table format
                  document.querySelector("#student-info").innerHTML = `
                      <div class="alert alert-warning mb-4">
                          <h4>Student Information</h4>
                      </div>

                      <!-- Student Profile Table -->
                      <table class="table table-bordered mb-4">
                          <thead class="table-info">
                              <tr>
                                  <th>Field</th>
                                  <th>Value</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>First Name</td>
                                  <td>${data.first_name}</td>
                              </tr>
                              <tr>
                                  <td>Last Name</td>
                                  <td>${data.last_name}</td>
                              </tr>
                              <tr>
                                  <td>App ID</td>
                                  <td>${data.user_id}</td>
                              </tr>
                              <tr>
                                  <td>Phone</td>
                                  <td>${data.phone}</td>
                              </tr>
                              <tr>
                                  <td>Email</td>
                                  <td>${data.email}</td>
                              </tr>
                              <tr>
                                  <td>Category</td>
                                  <td>${data.category}</td>
                              </tr>
                              <tr>
                                  <td>Gender</td>
                                  <td>${data.gender}</td>
                              </tr>
                              <tr>
                                  <td>Religion</td>
                                  <td>${data.religion}</td>
                              </tr>
                              <tr>
                                  <td>Status</td>
                                  <td>${data.status || 'Active'}</td>
                              </tr>
                              <tr>
                                  <td>Handicapped</td>
                                  <td>${data.handicapped ? 'Yes' : 'No'}</td>
                              </tr>
                              <tr>
                                  <td>Guardian</td>
                                  <td>${data.guardian}</td>
                              </tr>
                              <tr>
                                  <td>Biometric ID</td>
                                  <td>${data.pen_no}</td>
                              </tr>
                              <tr>
                                  <td>DOB</td>
                                  <td>${data.date_of_birth}</td>
                              </tr>
                              <tr>
                                  <td>Admission Date</td>
                                  <td>${data.admission_date}</td>
                              </tr>
                              <tr>
                                  <td>Sr No.</td>
                                  <td>${data.sr_no}</td>
                              </tr>
                          </tbody>
                      </table>

                      <!-- Father Details Table -->
                      <table class="table table-bordered mb-4">
                          <thead class="table-info">
                              <tr>
                                  <th>Field</th>
                                  <th>Value</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>Father's Name</td>
                                  <td>${data.father_name}</td>
                              </tr>
                              <tr>
                                  <td>Mobile</td>
                                  <td>${data.father_phone}</td>
                              </tr>
                              <tr>
                                  <td>Email</td>
                                  <td>${data.father_email}</td>
                              </tr>
                              <tr>
                                  <td>Occupation</td>
                                  <td>${data.father_occupation}</td>
                              </tr>
                              <tr>
                                  <td>Age</td>
                                  <td>${data.father_age}</td>
                              </tr>
                              <tr>
                                  <td>Income</td>
                                  <td>${data.father_income}</td>
                              </tr>
                          </tbody>
                      </table>

                      <!-- Mother Info Table -->
                      <table class="table table-bordered mb-4">
                          <thead class="table-info">
                              <tr>
                                  <th>Field</th>
                                  <th>Value</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>Mother's Name</td>
                                  <td>${data.mother_name}</td>
                              </tr>
                              <tr>
                                  <td>Mobile</td>
                                  <td>${data.mother_phone}</td>
                              </tr>
                              <tr>
                                  <td>Email</td>
                                  <td>${data.mother_email}</td>
                              </tr>
                              <tr>
                                  <td>Occupation</td>
                                  <td>${data.mother_occupation}</td>
                              </tr>
                              <tr>
                                  <td>Age</td>
                                  <td>${data.mother_age}</td>
                              </tr>
                              <tr>
                                  <td>Income</td>
                                  <td>${data.mother_income}</td>
                              </tr>
                          </tbody>
                      </table>
                  `;
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
