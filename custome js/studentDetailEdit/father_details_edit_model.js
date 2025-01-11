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
      const modal = new bootstrap.Offcanvas(document.getElementById("editFatherModal"));
      modal.show();
    })
    .catch((error) => {
      console.error("Error loading the modal:", error);
      alert("Failed to load the father details modal. Please try again later.");
    });
}

// Export the function if using a module system
// export { loadFatherDetailsModal };
