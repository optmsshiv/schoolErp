$(document).ready(function () {
  let rowCount = 0;

  // Handle form submission via AJAX
  $("#bankDetailsForm").on("submit", function (e) {
    e.preventDefault();

    const bankData = {
      bankName: $("#bankName").val(),
      branchName: $("#branchName").val(),
      accountNumber: $("#accountNumber").val(),
      ifscCode: $("#ifscCode").val(),
      accountType: $("#accountType").val(),
    };

    $.ajax({
      url: "../php/bankDetails/saveBankDetails.php", // Replace with your PHP endpoint
      type: "POST",
      data: bankData,
      success: function (response) {
        const result = JSON.parse(response);
        if (result.status === "success") {
          rowCount++;
          $("#bankTable tbody").append(`
            <tr data-id="${result.id}">
              <td>${rowCount}</td>
              <td>${bankData.bankName}</td>
              <td>${bankData.branchName}</td>
              <td>${bankData.accountNumber}</td>
              <td>${bankData.ifscCode}</td>
              <td>${bankData.accountType}</td>
              <td>
                <button class="btn btn-sm btn-warning editBtn" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger deleteBtn" title="Delete"><i class="fas fa-trash-alt"></i></button>
              </td>
            </tr>
          `);

          // Reset the form
          $("#bankDetailsForm")[0].reset();

          // SweetAlert notification
          Swal.fire({
            icon: "success",
            title: "Bank Details Added",
            text: "The bank details have been successfully saved!",
            timer: 3000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || "Failed to save data.",
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while saving data. Please try again.",
        });
      },
    });
  });

  // Handle edit button click
  $(document).on("click", ".editBtn", function () {
    const row = $(this).closest("tr");
    const id = row.data("id");

    // Retrieve existing data and populate the form for editing
    $("#bankName").val(row.find("td:eq(1)").text());
    $("#branchName").val(row.find("td:eq(2)").text());
    $("#accountNumber").val(row.find("td:eq(3)").text());
    $("#ifscCode").val(row.find("td:eq(4)").text());
    $("#accountType").val(row.find("td:eq(5)").text());

    // Open SweetAlert confirmation dialog before updating
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to update this bank record.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Collect form data
        const updatedData = {
          id: id,
          bankName: $("#bankName").val(),
          branchName: $("#branchName").val(),
          accountNumber: $("#accountNumber").val(),
          ifscCode: $("#ifscCode").val(),
          accountType: $("#accountType").val(),
        };

        // Send AJAX request to update the record
        $.ajax({
          url: "../php/bankDetails/editBankDetails.php", // Replace with your PHP endpoint
          type: "POST",
          data: updatedData,
          success: function (response) {
            const data = JSON.parse(response);

            if (data.status === "success") {
              // Update table row dynamically
              row.find("td:eq(1)").text(updatedData.bankName);
              row.find("td:eq(2)").text(updatedData.branchName);
              row.find("td:eq(3)").text(updatedData.accountNumber);
              row.find("td:eq(4)").text(updatedData.ifscCode);
              row.find("td:eq(5)").text(updatedData.accountType);

              Swal.fire(
                'Updated!',
                'The bank details have been updated.',
                'success'
              );
            } else {
              Swal.fire(
                'Error!',
                'Failed to update the bank details.',
                'error'
              );
            }
          },
          error: function () {
            Swal.fire(
              'Error!',
              'There was a problem with the request.',
              'error'
            );
          }
        });
      } else {
        Swal.fire(
          'Cancelled',
          'Your update has been cancelled.',
          'info'
        );
      }
    });
  });


  // Handle delete button click
  $(document).on("click", ".deleteBtn", function () {
    const row = $(this).closest("tr");
    const id = row.data("id");

    if (confirm("Are you sure you want to delete this record?")) {
      $.ajax({
        url: "../php/bankDetails/deleteBankDetails.php", // Replace with your PHP endpoint
        type: "POST",
        data: { id: id },
        success: function (response) {
          const result = JSON.parse(response);
          if (result.status === "success") {
            row.remove();

            // SweetAlert notification
            Swal.fire({
              icon: "success",
              title: "Record Deleted",
              text: "The record has been successfully deleted.",
              timer: 3000,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: result.message || "Failed to delete record.",
            });
          }
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while deleting the record.",
          });
        },
      });
    }
  });

  // Fetch bank details on page load
  function fetchBankDetails() {
    $.ajax({
      url: "../php/bankDetails/fetchBankDetails.php", // Replace with the PHP file's URL
      type: "GET",
      success: function (response) {
        const data = JSON.parse(response);

        if (data.status === "success") {
          const tableBody = $("#bankTableBody");
          tableBody.empty(); // Clear existing rows

          if (data.data.length > 0) {
            // Iterate over the bank data and append rows to the table
          data.data.forEach((bank, index) => {
            tableBody.append(`
              <tr data-id="${bank.BankID}">
                <td>${index + 1}</td>
                <td>${bank.BankName}</td>
                <td>${bank.Branch}</td>
                <td>${bank.AccountNumber}</td>
                <td>${bank.IFSCCode}</td>
                <td>${bank.AccountType}</td>
                <td>
                  <button class="btn btn-sm btn-warning editBtn" title="Edit"><i class="fas fa-edit"></i></button>
                  <button class="btn btn-sm btn-danger deleteBtn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            `);
          });
        } else {
          // If no records found, display a placeholder row
          tableBody.append(`
            <tr>
              <td colspan="7" class="text-center">No bank details found.</td>
            </tr>
          `);
        }
       } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Failed to fetch data.",
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching bank details.",
        });
      },
    });
  }

  // Initial fetch
  fetchBankDetails();
});
