document.addEventListener("DOMContentLoaded", function () {
  const viewFeeReceiptLink = document.getElementById("viewFeeReceiptLink");

  if (viewFeeReceiptLink) {
    viewFeeReceiptLink.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default anchor behavior

      // Load modal content via AJAX
      fetch("/html/model/fee_reciept_paid.html") // Replace with the correct path to your modal file
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load modal");
          }
          return response.text();
        })
        .then((html) => {
          document.getElementById("modalContainer").innerHTML = html;

          // Show the modal
          const modalElement = new bootstrap.Modal(document.getElementById("viewFeeReceiptModal"));
          modalElement.show();
        })
        .catch((error) => {
          console.error(error);
          alert("Error loading modal.");
        });
    });
  }
});


