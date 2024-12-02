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
        // Parse response if needed and add the new entry to the table
        rowCount++;
        $("#bankHeadList tbody").append(`
          <tr data-id="${response.id}"> <!-- Assuming response includes the new record's ID -->
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
      },
      error: function (error) {
        alert("Failed to save data. Please try again.");
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

    // Add an additional action to update the record via AJAX
    // This can be implemented in a similar way to the save functionality
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
        success: function () {
          row.remove();
        },
        error: function () {
          alert("Failed to delete record. Please try again.");
        },
      });
    }
  });
  $(document).ready(function () {
    // Fetch bank details on page load
    function fetchBankDetails() {
      $.ajax({
        url: "../php/bankDetails/fetchBankDetails.php", // Replace with the PHP file's URL
        type: "GET",
        success: function (response) {
          const data = JSON.parse(response);

          if (data.status === "success") {
            const tableBody = $("#bankTable tbody");
            tableBody.empty(); // Clear existing rows

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
            alert(data.message || "Failed to fetch data.");
          }
        },
        error: function () {
          alert("An error occurred while fetching bank details.");
        },
      });
    }

    // Initial fetch
    fetchBankDetails();

    // Other actions like edit or delete can trigger refetch
    // Example:
    // $(document).on('click', '.deleteBtn', function() { ... fetchBankDetails(); });
  });


});
