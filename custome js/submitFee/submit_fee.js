document.getElementById("submitFeeDetails").addEventListener("click", function () {
  // Gather form data
  const formData = {
    user_id: document.getElementById("userId").value || 0, // Assuming you have a field for student ID
    student_name: document.getElementById("studentName")?.value || "", // Assuming a field for student name
    receipt_no: generateReceiptNumber(), // Call a function to generate a unique receipt number
    month: document.getElementById("feeMonth").value, // Assuming you have a field for the month
    fee_type: document.getElementById("feeType").value, // Assuming a field for fee type
    hostel_fee: parseFloat(document.getElementById("hostelFee")?.value || 0.0), // Add if you handle hostel fees
    transport_fee: parseFloat(document.getElementById("transportFee")?.value || 0.0), // Add if you handle transport fees
    additional_amount: parseFloat(document.getElementById("additionalAmount").value || 0.0),
    concession_amount: parseFloat(document.getElementById("concessionFee").value || 0.0),
    received_amount: parseFloat(document.getElementById("recievedFee").value || 0.0),
    due_amount: parseFloat(document.getElementById("dueAmount").value || 0.0),
    advanced_amount: parseFloat(document.getElementById("advancedFee").value || 0.0),
    total_amount: parseFloat(document.getElementById("payableAmount").value || 0.0),
    payment_status: document.getElementById("paymentStatus").value,
    payment_type: document.getElementById("paymentType")?.value || "",
    bank_name: document.getElementById("bankName")?.value || "",
    payment_date: document.getElementById("dateSelection").value,
    remark: document.getElementById("remark").value,
  };

  // Validate required fields before submission
  //if (!formData.student_id || !formData.student_name || !formData.receipt_no || !formData.month || !formData.fee_type) {
  //  alert("Please fill all required fields.");
  //  return;
  //}

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

// Function to generate a unique receipt number
function generateReceiptNumber() {
  const now = new Date();
  return `RCP-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now
    .getDate()
    .toString()
    .padStart(2, "0")}-${Math.floor(Math.random() * 10000)}`;
}
