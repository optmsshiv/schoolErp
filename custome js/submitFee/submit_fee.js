document.getElementById("submitFeeDetails").addEventListener("click", function () {
  // Gather form data
  const formData = {
    additionalAmount: document.getElementById("additionalAmount").value,
    concessionFee: document.getElementById("concessionFee").value,
    payableAmount: document.getElementById("payableAmount").value,
    recievedFee: document.getElementById("recievedFee").value,
    dueAmount: document.getElementById("dueAmount").value,
    advancedFee: document.getElementById("advancedFee").value,
    paymentStatus: document.getElementById("paymentStatus").value,
    paymentType: document.getElementById("paymentType")?.value || "",
    bankName: document.getElementById("bankName")?.value || "",
    dateSelection: document.getElementById("dateSelection").value,
    remark: document.getElementById("remark").value,
  };

  // Send data to the PHP script
  fetch("/php/submitFee/submit_fee_details.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Fee details submitted successfully!");
        // Optionally, clear the form or reload the page
        document.querySelector("form").reset();
      } else {
        alert("Error submitting fee details: " + data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    });
});
