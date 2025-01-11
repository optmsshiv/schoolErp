// Function to load the Mother Details modal
function loadMotherDetailsModal(data) {
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
