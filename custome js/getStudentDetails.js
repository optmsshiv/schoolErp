let studentData = null; // Declare a variable to hold student data
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
        studentData = data; // Store the student data globally

        if (data.error) {
          // Display error message
          document.querySelector("#student-info").innerHTML = `
                    <p class="text-danger">${data.error}</p>`;
        } else {
          // Populate the table with fetched data
          document.querySelector("#student-info").innerHTML = `
                    <div class="border p-3 mb-2 mt-3 position-relative">
                      <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Student Profile</h5>
                      <div class="d-flex justify-content-end mb-3">
                        <button class="btn btn-primary btn-sm" id="editButton" aria-controls="editOffcanvas">Edit</button>
                      </div>
                      <table class="table table-borderless">
                        <thead>
                          <tr class="table-info">
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
                            <th></th>
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
                            <th></th>
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
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
                            <td><strong>Roll No</strong></td>
                            <td>:</td>
                            <td>${data.roll_no}</td>
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
                            <td><strong>Religion</strong></td>
                            <td>:</td>
                            <td>${data.religion}</td>
                          </tr>
                        </tbody>
                      </table>
                      </div>

                      <!-- Father Details -->
                      <div class="border p-3 mb-2 mt-4 position-relative">
                         <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Father Details</h5>
                         <div class="d-flex justify-content-end mb-3">
                           <button class="btn btn-primary btn-sm" id="editButtonFather">Edit</button>
                          </div>
                         <table class="table table-borderless">
                        <thead>
                          <tr class="table-info">
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
                            <th></th>
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
                            <th></th>
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
                            <th></th>
                          </tr>
                        </thead>
                             <tbody>
                               <tr>
                                 <td><strong>Father's Name</strong></td>
                                 <td>:</td>
                                 <td>${data.father_name}</td>
                                 <td><strong>Mobile</strong></td>
                                 <td>:</td>
                                 <td>${data.father_phone}</td>
                                 <td><strong>Email</strong></td>
                                 <td>:</td>
                                 <td>${data.sr_no}</td>
                               </tr>
                               <tr>
                                 <td><strong>Occupation</strong></td>
                                 <td>:</td>
                                 <td>${data.father_occupation}</td>
                                 <td><strong>Age</strong></td>
                                 <td>:</td>
                                 <td>${data.sr_no}</td>
                                 <td><strong>Father Aadhar</strong></td>
                                 <td>:</td>
                                 <td>${data.father_aadhar}</td>
                               </tr>
                               <tr>
                                 <td><strong>Income</strong></td>
                                 <td>:</td>
                                 <td>${data.father_income}</td>
                                 <td><strong>Sr No.</strong></td>
                                 <td>:</td>
                                 <td>${data.sr_no}</td>
                                 <td></td>
                                 <td></td>
                                 <td></td>
                               </tr>
                             </tbody>
                         </table>
                        </div>

                        <!-- Mother Details -->
                   <div class="border p-3 mb-3 position-relative mt-4">
                        <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Mother Info</h5>
                        <div class="d-flex justify-content-end mb-3">
                          <button class="btn btn-primary btn-sm" id="editButtonMother">Edit</button>
                    </div>
                        <table class="table table-borderless">
                        <thead>
                          <tr class="table-info">
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
                            <th></th>
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
                            <th></th>
                            <th style="width: 3%;"></th>
                            <th style="width: 0%;"></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Mother's Name</strong></td>
                            <td>:</td>
                            <td>${data.mother_name}</td>
                            <td><strong>Mobile</strong></td>
                            <td>:</td>
                            <td>${data.mother_phone}</td>
                            <td><strong>Email</strong></td>
                            <td>:</td>
                            <td>${data.mother_email}</td>
                          </tr>
                          <tr>
                            <td><strong>Occupation</strong></td>
                            <td>:</td>
                            <td>${data.mother_occupation}</td>
                            <td><strong>Age</strong></td>
                            <td>:</td>
                            <td>${data.mother_age}</td>
                            <td><strong>Mohter Aadhar</strong></td>
                            <td>:</td>
                            <td>${data.mother_aadhar}</td>
                          </tr>
                          <tr>
                            <td><strong>Income</strong></td>
                            <td>:</td>
                            <td>${data.mother_income}</td>
                            <td><strong>Sr No.</strong></td>
                            <td>:</td>
                            <td>${data.sr_no}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Address Details -->
                    <div class="border p-3 mb-2 mt-4 position-relative">
                      <h5 class="border-section-header position-absolute bg-white px-2 badge bg-label-info">Address</h5>
                      <div class="d-flex justify-content-end mb-3">
                        <button class="btn btn-primary btn-sm" id="editButtonAddress">Edit</button>
                      </div>
                      <table class="table table-borderless">
                        <thead>
                            <tr class="table-info">
                              <th style="width: 3%;"></th>
                              <th style="width: 0%;"></th>
                              <th></th>
                              <th style="width: 3%;"></th>
                              <th style="width: 0%;"></th>
                              <th></th>
                              <th style="width: 3%;"></th>
                              <th style="width: 0%;"></th>
                              <th></th>
                            </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Current Address</strong></td>
                            <td>:</td>
                            <td>${data.current_add}</td>
                            <td><strong>City</strong></td>
                            <td>:</td>
                            <td>${data.city_name}</td>
                            <td><strong>State</strong></td>
                            <td>:</td>
                            <td>${data.state}</td>
                          </tr>
                          <tr>
                            <td><strong>Permanent Address</strong></td>
                            <td>:</td>
                            <td>${data.permanent_add}</td>
                            <td><strong>Pincode</strong></td>
                            <td>:</td>
                            <td>${data.pincode}</td>
                            <td><strong>Country</strong></td>
                            <td>:</td>
                            <td>${data.country}</td>
                          </tr>
                          <tr>
                            <td><strong>Landmark</strong></td>
                            <td>:</td>
                            <td>${data.landmark}</td>
                            <td><strong>Sr No.</strong></td>
                            <td>:</td>
                            <td>${data.sr_no || ''}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>`;
          // Dynamically load the editDetailCanva.js script after the "Edit" button is created
          const script = document.createElement('script');
          script.src = '../custome js/studentDetailEdit/student_detail_edit_canva.js';  // Use the correct path to your script
          script.type = 'text/javascript';
          document.body.appendChild(script);

          // Add event listener for the edit button after the content is rendered
          document.getElementById('editButton').addEventListener('click', () => {
            // Call the function from editDetailCanva.js here if needed
            console.log('Edit button clicked, and the script is loaded!');
          });
          // Add global click listener for dynamic "Edit" buttons
          document.addEventListener("click", (event) => {
            if (event.target.id === "editButtonFather") {
              handleFatherEdit(data);
            } else if (event.target.id === "editButtonMother") {
              handleMotherEdit(data);
            } else if (event.target.id === "editButtonAddress") {
              handleAddressEdit(data);
            }
          });
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


/**
 * Function to load and display the Father Details modal.
 * @param {Object} data - The student data object containing father details.
 */
function handleFatherEdit(data) {
  // Fetch the HTML content for the Father Details modal
  fetch("/html/profielOffcanvaEdit/fatherDetailsModel.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load the modal.");
      }
      return response.text();
    })
    .then((html) => {
      // Append the modal HTML to the body
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = html;
      document.body.appendChild(modalContainer);

      // Populate the modal with father details from the provided data
      document.getElementById("fatherName").value = data.father_name;
      document.getElementById("fatherPhone").value = data.father_phone;
      document.getElementById("fatherEmail").value = data.father_email;
      document.getElementById("fatherOccupation").value = data.father_occupation;
      document.getElementById("fatherAadhar").value = data.father_aadhar;
      document.getElementById("fatherIncome").value = data.father_income;

      // Initialize and show the modal using Bootstrap's Offcanvas
      const modal = new bootstrap.Modal(document.getElementById("editFatherModal"));
      modal.show();
    })
    .catch((error) => {
      console.error("Error loading the modal:", error);
      alert("Failed to load the father details modal. Please try again later.");
    });
}

// Export the function if using a module system
// export { loadFatherDetailsModal };

// Function to load the Mother Details modal
function handleMotherEdit(data) {
  fetch("/html/profielOffcanvaEdit/motherDetailsModel.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load the modal.");
      }
      return response.text();
    })
    .then((html) => {
      // Append the modal HTML to the body
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = html;
      document.body.appendChild(modalContainer);

      // Populate the modal with data
      document.getElementById("motherName").value = data.mother_name;
      document.getElementById("motherPhone").value = data.mother_phone;
      document.getElementById("motherEmail").value = data.mother_email;
      document.getElementById("motherOccupation").value = data.mother_occupation;
      document.getElementById("motherAadhar").value = data.mother_aadhar;
      document.getElementById("motherIncome").value = data.mother_income;

      // Show the modal
      const modal = new bootstrap.Modal(document.getElementById("editMotherModal"));
      modal.show();
    })
    .catch((error) => {
      console.error("Error loading the modal:", error);
      alert("Failed to load the mother details modal. Please try again later.");
    });
}

function handleAddressEdit(data) {
  fetch("/html/profielOffcanvaEdit/address_modal.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load the modal.");
      }
      return response.text();
    })
    .then((html) => {
      // Append the modal HTML to the body
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = html;
      document.body.appendChild(modalContainer);

      // Populate the modal with data
      document.getElementById("currentAddress").value = data.current_add;
      document.getElementById("city").value = data.city_name;
      document.getElementById("state").value = data.state;
      document.getElementById("permanentAddress").value = data.permanent_add;
      document.getElementById("pincode").value = data.pincode;
      document.getElementById("country").value = data.country;
      document.getElementById("landmark").value = data.landmark;
      document.getElementById("srNo").value = data.sr_no || '';

      // Show the modal
      const modal = new bootstrap.Modal(document.getElementById("editAddressModal"));
      modal.show();
    })
    .catch((error) => {
      console.error("Error loading the modal:", error);
      alert("Failed to load the address details modal. Please try again later.");
    });
}
