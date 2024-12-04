// Function to handle fee saving
function saveFee() {
  const feeHeadId = document.getElementById('feeHeadDropdown').value;
  const feeAmount = document.getElementById('feeAmount').value;

  // Validate inputs
  if (!feeHeadId || !feeAmount) {
      alert('Please select a fee head and enter an amount.');
      return;
  }

  // Send data to the server using AJAX
  fetch('../php/feeCanva/save_canva_fee.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
          fee_head_id: feeHeadId,
          fee_amount: feeAmount
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          addRowToTable(data.data);
      } else {
          alert(data.message || 'Failed to save fee.');
      }
  })
  .catch(error => console.error('Error:', error));
}

// Function to add a row to the table
function addRowToTable(data) {
  const tableBody = document.querySelector('#FeeCollection tbody');

  const row = document.createElement('tr');
  row.innerHTML = `
      <td>${data.fee_type}</td>
      <td>${data.total}</td>
      <td>
          <button class="btn text-danger p-0" onclick="deleteRow(${data.id}, this)">
              <i class="bx bx-trash bx-sm"></i>
          </button>
      </td>
  `;

  tableBody.appendChild(row);
}

// Function to delete a row from the table and database
function deleteRow(id, button) {
  fetch(`../php/feeCanva/delete_canva_fee_from_table.php?id=${id}`, { method: 'GET' })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          const row = button.closest('tr');
          row.remove();
      } else {
          alert(data.message || 'Failed to delete fee.');
      }
  })
  .catch(error => console.error('Error:', error));
}
