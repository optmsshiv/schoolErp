// Load the modal HTML into the modalContainer div
fetch('../model/model.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('modalContainer').innerHTML = data;

    // Add event listener for the save button
    document.getElementById('saveButton').addEventListener('click', function() {
      const name = document.getElementById('modalName').value;
      const fatherName = document.getElementById('modalFatherName').value;
      const motherName = document.getElementById('modalMotherName').value;
      const className = document.getElementById('modalClassName').value;
      const phone = document.getElementById('modalPhone').value;
      const dob = document.getElementById('modalDob').value;
      const gender = document.getElementById('modalGender').value;
      const address = document.getElementById('modalAddress').value;
      const enquiryDate = document.getElementById('modalEnquiry').value

      if (name && fatherName && dob && phone && address && gender && enquiryDate) {
        const table = document.getElementById('ModeldataTable');
        const row = table.insertRow();
        const serialNumber = table.rows.length;

        // Format the date
        const dateObj = new Date(dob);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1; // Months are zero-based
        const year = dateObj.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // Format the date
        const enqDate = new Date(enquiryDate);
        const days = enqDate.getDate();
        const months = enqDate.getMonth() + 1; // Months are zero-based
        const years = enqDate.getFullYear();
        const enquireDate = `${days}-${months}-${years}`;

        // Insert new row
        row.insertCell(0).innerHTML = serialNumber
        row.insertCell(1).innerText = name;
        row.insertCell(2).innerText = fatherName;
        row.insertCell(3).innerText = motherName;
        row.insertCell(4).innerText = className;
        row.insertCell(5).innerText = phone;
        row.insertCell(6).innerText = formattedDate;
        row.insertCell(7).innerText = gender;
        row.insertCell(8).innerText = address;
        row.insertCell(9).innerText = enquireDate;

        // Clear the form fields
        document.getElementById('modalForm').reset();

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
        modal.hide();
      } else {
        alert('Please fill out all fields');
      }
    });
  });

  /******************************add canvas right****************/

