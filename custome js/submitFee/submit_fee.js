document.getElementById("submitFeeDetails").addEventListener("click", function () {
  // Retrieve the student data from session storage
  const studentData = JSON.parse(sessionStorage.getItem("studentData"));

  if (!studentData || studentData.length === 0) {
    // If student data is missing or invalid, show an error message
    console.error("No valid student data found in session storage.");
    alert("Student data is missing or invalid.");
    return;
  }

   // Assume the first object in studentData contains the required fields
  const { user_id, full_name: student_name } = studentData[0];

  if (!user_id) {
    alert("User ID is missing. Please ensure a student is selected.");
    return;
  }

  // Extract Month and Fee Type from the FeeCollection table
  const feeTable = document.querySelector("#FeeCollection tbody");
  const rows = feeTable.querySelectorAll("tr"); // Get all rows in the table
  const feeData = [];

  rows.forEach(row => {
    const month = row.cells[0] ? row.cells[0].textContent.trim() : '';  // Get Month from the first cell
    const feeType = row.cells[1] ? row.cells[1].textContent.trim() : ''; // Get Fee Type from the second cell
    const amount = row.cells[2] ? row.cells[2].textContent.trim() : ''; // Get Amount from the third cell

    if (month && feeType && amount) { // Only push non-empty values
      feeData.push({ month, feeType, amount });
    }
  });

  // Log the extracted values (for debugging purposes)
  console.log("Fee Data:", feeData);

  // Gather form data & Create the form data with the extracted values
  const formData = {
    user_id, // From session storage
    student_name, // From session storage
    receipt_no: generateReceiptNumber(), // Call a function to generate a unique receipt number
    fee_data: feeData,  // Add extracted fee data (array of months and fee types)
    hostel_fee: parseFloat(document.getElementById("hostelFee")?.value || 0.0), // Add if you handle hostel fees
    transport_fee: parseFloat(document.getElementById("transportFee")?.value || 0.0), // Add if you handle transport fees
  //  additional_amount: parseFloat(document.getElementById("additionalAmount").value || 0.0),
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

  console.log("Form Data:", formData);// Log the form data for debugging
  // Call the submit function with the form data
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
        // Show SweetAlert on success
       if (formData.payment_status === "pending") {
          // Show SweetAlert for pending payment status
          Swal.fire({
            title: 'Dues Created!',
            text: `Dues have been created for Student: ${student_name}`,
            icon: 'info',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to collect_fee.html when user clicks OK
              window.location.href = '/html/collect_fee.html';
            }
          });
        } else {
          // Show SweetAlert for successful payment
          Swal.fire({
            title: 'Payment Submitted!',
            text: `Payment has been submitted for Student: ${student_name}`,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to collect_fee.html when user clicks OK
              window.location.href = '/html/collect_fee.html';
            }
          });
        }
      } else {
        alert("Error submitting fee details: " + data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    });
});

// Event listener for the Cancel button
document.querySelector(".btn-secondary").addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be redirected to the fee collection page in 5 seconds.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, proceed",
    cancelButtonText: "No, stay here",
    timer: 5000,
    timerProgressBar: true,
    didOpen: () => {
      const b = Swal.getHtmlContainer().querySelector("b");
      const interval = setInterval(() => {
        if (b) {
          b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }
      }, 1000);
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirect to collect_fee.html after confirmation
      window.location.href = "/html/collect_fee.html";
    } else if (result.dismiss === Swal.DismissReason.timer) {
      // Redirect automatically after 5 seconds if no action is taken
      window.location.href = "/html/collect_fee.html";
    }
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
