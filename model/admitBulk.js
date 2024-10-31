document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const processButton = document.getElementById("processButton");
  const resetButton = document.getElementById("resetButton");
  const submitButton = document.getElementById("submitButton");
  const fileInput = document.getElementById("inputGroupFile01");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const form = document.getElementById("studentBulkData");

  // Show loading indicator when form is submitted
  form.addEventListener("submit", function (e) {
    loadingIndicator.style.display = "flex"; // Show loading indicator
    submitButton.disabled = true; // Disable submit button
  });

  // Process file button - add any custom file processing if needed
  processButton.addEventListener("click", function () {
    if (fileInput.files.length === 0) {
      alert("Please select a file first.");
      return;
    }

    // You can add custom file processing here if needed
    alert("File is ready to be processed.");
  });

  // Reset form and hide loading indicator
  resetButton.addEventListener("click", function () {
    form.reset();
    loadingIndicator.style.display = "none"; // Hide loading indicator
    submitButton.disabled = false; // Enable submit button
  });

  // Submit event for file upload and server data submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Create FormData object and append the file data
    const formData = new FormData(form);
    formData.append("file", fileInput.files[0]);

    try {
      const response = await fetch("../php/admit_bulk_submit.php", {
        method: "POST",
        body: formData,
      });

      // Check if response is okay
      if (!response.ok) {
        throw new Error("Server error: " + response.statusText);
      }

      const result = await response.json();

      if (result.success) {
        alert("Data uploaded successfully!");
      } else {
        alert("Error uploading data: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload data. Please try again.");
    } finally {
      // Hide loading indicator and re-enable submit button
      loadingIndicator.style.display = "none";
      submitButton.disabled = false;
    }
  });
});
