document.addEventListener("DOMContentLoaded", () => {
  // Get the user_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("user_id");

  const studentProfileElement = document.getElementById('student-profile');

  if (userId) {
      // Show a loading message
      studentProfileElement.innerHTML = `<p class="text-info">Loading student details...</p>`;

      // Fetch student data from the backend
      fetch(`../php/studentInfo/getStudentDetails.php?user_id=${userId}`)
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  // Display error message
                  studentProfileElement.innerHTML = `
                      <p class="text-danger">${data.error}</p>`;
              } else {
                  // Populate student details
                  studentProfileElement.innerHTML = `
                    <div class="container mt-2">
            <h2 class="text-center mb-4">Student Details</h2>
            <!-- Tabs navigation -->
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="student-info-tab" data-bs-toggle="tab"
                  data-bs-target="#student-info" type="button" role="tab" aria-controls="student-info"
                  aria-selected="true">Student Info</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="fee-details-tab" data-bs-toggle="tab"
                  data-bs-target="#fee-details" type="button" role="tab" aria-controls="fee-details"
                  aria-selected="false">Fee Details</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="transport-tab" data-bs-toggle="tab" data-bs-target="#transport"
                  type="button" role="tab" aria-controls="transport" aria-selected="false">Transport</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="hostel-tab" data-bs-toggle="tab" data-bs-target="#hostel"
                  type="button" role="tab" aria-controls="hostel" aria-selected="false">Hostel</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="documents-tab" data-bs-toggle="tab" data-bs-target="#documents"
                  type="button" role="tab" aria-controls="documents" aria-selected="false">Documents</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="others-tab" data-bs-toggle="tab" data-bs-target="#others"
                  type="button" role="tab" aria-controls="others" aria-selected="false">Others</button>
              </li>
            </ul>

            <!-- Tabs content -->
            <div class="tab-content mt-3" id="myTabContent">
              <!-- Student Info Tab -->
              <div class="tab-pane fade show active" id="student-info" role="tabpanel"
                aria-labelledby="student-info-tab">
                <div class="px-2 alert alert-warning" role="alert">
                <h4>Student Information : </h4></div>

                <!-- Student Profile Section -->
                <div class="border p-3 mb-2 mt-3 position-relative">
                  <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Student Profile</h5>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-primary btn-sm">Edit</button>
                  </div>
                  <div class="row">
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
                  </div>
                  </div>
                </div>

                <div class="border p-3 mb-2 mt-4 position-relative">
                  <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Father Details</h5>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-primary btn-sm">Edit</button>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <p><strong>Father's Name :</strong> John</p>
                      <p><strong>Mobile :</strong> 123456</p>
                      <p><strong>Email:</strong> john@example.com</p>
                    </div>
                    <div class="col-md-4">
                      <p><strong>Occupation :</strong> Govt-job</p>
                      <p><strong>Age:</strong> Male</p>
                      <p><strong>Religion:</strong> Hindu</p>
                    </div>
                    <div class="col-md-4">
                      <p><strong>Income :</strong> Mr. Richard Doe</p>
                      <p><strong>Sr No.:</strong> 1</p>
                    </div>
                  </div>
                </div>
                <!-- Mother Info Section -->
                <div class="border p-3 mb-3 position-relative mt-4">
                  <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Mother Info</h5>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-primary btn-sm">Edit</button>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <p><strong>Mother's Name:</strong> John</p>
                      <p><strong>Mobile:</strong> 123456</p>
                      <p><strong>Email:</strong> john@example.com</p>
                    </div>
                    <div class="col-md-4">
                      <p><strong>Occupation:</strong> Doe</p>
                      <p><strong>Age:</strong> Male</p>
                      <p><strong>Religion:</strong> Hindu</p>
                    </div>
                    <div class="col-md-4">
                      <p><strong>Income:</strong> Mr. Richard Doe</p>
                      <p><strong>Sr No.:</strong> 1</p>
                    </div>
                  </div>
                </div>

                <!-- Address Section -->
                <div class="border p-3 mb-2 mt-4 position-relative">
                  <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Address</h5>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-primary btn-sm">Edit</button>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <p><strong>Current Address:</strong> Adarsh Nagar Ward 08</p>
                      <p><strong>City:</strong> Mdhepura</p>
                      <p><strong>State:</strong> Bihar</p>
                    </div>
                    <div class="col-md-4">
                      <p><strong>Permanent Address :</strong> Adarsh Nagar Ward 08</p>
                      <p><strong>Pincode :</strong> 123456</p>
                      <p><strong>Country :</strong> India</p>
                    </div>
                    <div class="col-md-4">
                      <p><strong>Landmark :</strong> Adarsh Nagar Ward 08</p>
                      <p><strong>Sr No.:</strong> 1</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Fee Details Tab -->
              <div class="tab-pane fade" id="fee-details" role="tabpanel" aria-labelledby="fee-details-tab">
                <h4>Fee Details</h4>
                <div class="row mt-4">
                  <!-- Total Fee Card -->
                  <div class="col-md-3">
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">Total Fee</h5>
                        <p class="card-text fs-4">₹50,000</p>
                      </div>
                    </div>
                  </div>
                  <!-- Total Transport Fee Card -->
                  <div class="col-md-3">
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">Total Transport Fee</h5>
                        <p class="card-text fs-4">₹10,000</p>
                      </div>
                    </div>
                  </div>
                  <!-- Total Hostel Fee Card -->
                  <div class="col-md-3">
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">Total Hostel Fee</h5>
                        <p class="card-text fs-4">₹20,000</p>
                      </div>
                    </div>
                  </div>
                  <!-- Total Amount Card -->
                  <div class="col-md-3">
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">Total Amount</h5>
                        <p class="card-text fs-4">₹80,000</p>
                      </div>
                    </div>
                  </div>

                  <div class="col-xxl container-p-y">
                    <div class="card userCard">
                      <h4 class="text-center fw-bold ms-3 d-flex">Student Fee Details</h4>

                      <div class="table-responsive">
                        <table id="optms" class="table table-md table-hover table-bordered  border-bottom"
                          style=" width:100%">
                          <thead class="thead-light">
                            <tr>
                              <th scope="col" class="fw-bold" style="width: 20%;">Month</th>
                              <th scope="col" class="fw-bold" style="width: 5%;">Due Amount</th>
                              <th scope="col" class="fw-bold" style="width: 5%;">Pending Amount</th>
                              <th scope="col" class="fw-bold" style="width: 5%;">Recieved Amount</th>
                              <th scope="col" class="fw-bold" style="width: 5%;">Total Amount</th>
                              <th scope="col" class="fw-bold" style="width: 5%;">Status</th>
                              <th scope="col" class="fw-bold">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>August</td>
                              <td>5000</td>
                              <td>4000</td>
                              <td>15000</td>
                              <td>24000</td>
                              <td><span class="badge bg-label-success me-1">Paid</span></td>
                              <td>Action</td>
                            </tr>
                            <tr>
                              <td>September</td>
                              <td></td>
                              <td>24000</td>
                              <td></td>
                              <td></td>
                              <td><span class="badge bg-label-danger me-1">Pending</span></td>
                              <td>Action</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Transport Tab -->
              <div class="tab-pane fade" id="transport" role="tabpanel" aria-labelledby="transport-tab">
                <h4>Transport</h4>
                <p>Details about transport go here.</p>
              </div>
              <!-- Hostel Tab -->
              <div class="tab-pane fade" id="hostel" role="tabpanel" aria-labelledby="hostel-tab">
                <h4>Hostel</h4>
                <p>Details about hostel accommodation go here.</p>
              </div>
              <!-- Documents Tab -->
              <div class="tab-pane fade" id="documents" role="tabpanel" aria-labelledby="documents-tab">
                <h4>Documents</h4>
                <p>Details about submitted documents go here.</p>
              </div>
              <!-- Others Tab -->
              <div class="tab-pane fade" id="others" role="tabpanel" aria-labelledby="others-tab">
                <h4>Others</h4>
                <p>Additional information goes here.</p>
              </div>
            </div>


            <!---Container-->
          </div>
                      `;
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
          <p class="text-danger">No student selected. Please go back and select a student in Active Students.</p>`;
  }
});
