document.addEventListener('DOMContentLoaded', function() {
  const feeHeadForm = document.getElementById('feeHeadForm');
  const feeHeadList = document.getElementById('feeHeadList');
  const feePlanForm = document.getElementById('createFeePlanForm');
  const feePlanTable = document.getElementById('feePlanBody');
  const feeHeadSelect = document.getElementById('feeHeadSelect');

  // Handle Fee Head Form Submission
  feeHeadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const feeHeadName = document.getElementById('feeHeadName').value;

    if (!feeHeadName) {
      alert('Please enter a fee head name');
      return;
    }

    $.ajax({
      url: '../php/insert_fee_plan.php',
      type: 'POST',
      dataType: 'json',
      data: { feeHeadName: feeHeadName },
      success: function(response) {
        if (response.status === 'success') {
          $('#feeHeadName').val('');
          loadFeeHeads();
        } else {
          alert('Error: ' + response.message);
        }
      },
      error: function() {
        alert('An error occurred while processing the request');
      }
    });
  });

  // Function to load and display the list of fee heads
  function loadFeeHeads() {
    $.ajax({
      url: '../php/fetch_fee_plan.php',
      type: 'GET',
      dataType: 'json',
      success: function(response) {
        if (response.data) {
          feeHeadList.innerHTML = '';
          feeHeadSelect.innerHTML = ''; // Clear existing options

          response.data.forEach(function(feeHead) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = feeHead.name;

            const buttonGroup = document.createElement('div');
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-sm btn-warning me-2';
            editButton.textContent = 'Edit';
            editButton.onclick = function() {
              editFeeHead(listItem, feeHead.name);
            };

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-sm btn-danger';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
              deleteFeeHead(listItem, feeHead.name);
            };

            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(deleteButton);

            listItem.appendChild(nameSpan);
            listItem.appendChild(buttonGroup);
            feeHeadList.appendChild(listItem);

            const option = document.createElement('option');
            option.value = feeHead.name;
            option.textContent = feeHead.name;
            feeHeadSelect.appendChild(option);
          });
        }
      },
      error: function() {
        alert('An error occurred while loading the fee heads');
      }
    });
  }

  loadFeeHeads();

  function editFeeHead(listItem, currentName) {
    const newName = prompt("Edit Fee Head Name:", currentName);
    if (newName && newName !== currentName) {
      $.ajax({
        url: '../php/update_fee_head.php',
        type: 'POST',
        dataType: 'json',
        data: { oldName: currentName, newName: newName },
        success: function(response) {
          if (response.status === 'success') {
            loadFeeHeads();
          } else {
            alert('Error updating fee head: ' + response.message);
          }
        },
        error: function() {
          alert('An error occurred while updating the fee head');
        }
      });
    }
  }

  function deleteFeeHead(listItem, feeHeadName) {
    $.ajax({
      url: '../php/delete_fee_head.php',
      type: 'POST',
      dataType: 'json',
      data: { feeHeadName: feeHeadName },
      success: function(response) {
        if (response.status === 'success') {
          loadFeeHeads();
        } else {
          alert('Error deleting fee head: ' + response.message);
        }
      },
      error: function() {
        alert('An error occurred while deleting the fee head');
      }
    });
  }

  feePlanForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const feeHead = feeHeadSelect.value;
    const selectedClasses = Array.from(document.querySelectorAll('input[name="class"]:checked')).map(input => input.value);
    const selectedMonths = Array.from(document.querySelectorAll('input[name="month"]:checked')).map(input => input.value);
    const feeAmount = document.getElementById('feeAmount').value;

    if (!feeHead || selectedClasses.length === 0 || selectedMonths.length === 0 || !feeAmount) {
      alert('Please fill all required fields');
      return;
    }

    selectedClasses.forEach(className => {
      selectedMonths.forEach(month => {
        const row = feePlanTable.insertRow();
        row.innerHTML = `
          <td>${className}</td>
          <td>${feeHead}</td>
          <td>${month}</td>
          <td>${feeAmount}</td>
          <td>
            <button onclick="editFeePlan(this)">Edit</button>
            <button onclick="deleteFeePlan(this)">Delete</button>
          </td>
        `;
      });
    });

    feePlanForm.reset();
  });
});

// Function to edit a fee plan
function editFeePlan(button) {
  const row = button.closest('tr');
  const feeHead = row.cells[1].textContent;
  const month = row.cells[2].textContent;
  const feeAmount = row.cells[3].textContent;

  document.getElementById('feeHeadSelect').value = feeHead;
  document.getElementById('feeAmount').value = feeAmount;

  Array.from(document.querySelectorAll('input[name="class"]')).forEach(classCheckbox => {
    classCheckbox.checked = classCheckbox.value === row.cells[0].textContent;
  });

  Array.from(document.querySelectorAll('input[name="month"]')).forEach(monthCheckbox => {
    monthCheckbox.checked = monthCheckbox.value === month;
  });

  row.remove();
}

function deleteFeePlan(button) {
  const row = button.closest('tr');
  row.remove();
}

function selectAllMonths(checkbox) {
  document.querySelectorAll('input[name="month"]').forEach(cb => cb.checked = checkbox.checked);
}

document.getElementById('selectAllMonths').addEventListener('change', function() {
  selectAllMonths(this);
});

function updateAllMonthsCheckbox() {
  const allMonthsCheckbox = document.getElementById('selectAllMonths');
  const monthCheckboxes = document.querySelectorAll('input[name="month"]');
  allMonthsCheckbox.checked = Array.from(monthCheckboxes).every(cb => cb.checked);
}

document.querySelectorAll('input[name="month"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateAllMonthsCheckbox);
});
