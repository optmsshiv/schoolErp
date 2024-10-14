
    document.getElementById('addButton').addEventListener('click', function() {
      Swal.fire({
        title: 'Add Information',
        html: `
          <input type="text" id="swalName" class="swal2-input" placeholder="Full Name">
          <input type="text" id="swalFatherName" class="swal2-input" placeholder="Father's Name">
          <input type="date" id="swalDob" class="swal2-input">
        `,
        focusConfirm: false,
        preConfirm: () => {
          const name = document.getElementById('swalFullName').value;
          const fatherName = document.getElementById('swalFatherName').value;
          const dob = document.getElementById('swalDob').value;
          if (name && fatherName && dob) {
            const table = document.getElementById('SweetdataTable');
            const row = table.insertRow();
            row.insertCell(0).innerText = name;
            row.insertCell(1).innerText = fatherName;
            row.insertCell(2).innerText = dob;
          } else {
            Swal.showValidationMessage('Please fill out all fields');
          }
        }
      });
    });

