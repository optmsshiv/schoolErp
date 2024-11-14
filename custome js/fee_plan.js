document.addEventListener('DOMContentLoaded', function() {
  const feeHeadForm = document.getElementById('feeHeadForm');
  const feeHeadList = document.getElementById('feeHeadList');
  const feePlanForm = document.getElementById('createFeePlanForm');
  const feePlanTable = document.getElementById('feePlanBody');
  const feeHeadSelect = document.getElementById('feeHeadSelect');

  // Handle Fee Head Form Submission
  feeHeadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const feeHeadName = document.getElementById('feeHeadName').value.trim();

    if (!feeHeadName) {
      alert('Please enter a fee head name');
      return;
    }

    $.ajax({
      url: '../php/insert_fee_plan.php',
      type: 'POST',
      dataType: 'json',
      data: { feeHeadName },
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
        feeHeadList.innerHTML = '';
        feeHeadSelect.innerHTML = ''; // Clear existing options

        response.data.forEach(feeHead => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

          const nameSpan = document.createElement('span');
          nameSpan.textContent = feeHead.fee_head_name;

          const buttonGroup = document.createElement('div');
          const editButton = createButton('Edit', 'btn-warning me-2', () => editFeeHead(feeHead.fee_head_name));
          const deleteButton = createButton('Delete', 'btn-danger', () => deleteFeeHead(feeHead.fee_head_name));

          buttonGroup.append(editButton, deleteButton);
          listItem.append(nameSpan, buttonGroup);
          feeHeadList.appendChild(listItem);

          const option = document.createElement('option');
          option.value = feeHead.fee_head_name;
          option.textContent = feeHead.fee_head_name;
          feeHeadSelect.appendChild(option);
        });
      },
      error: function() {
        alert('An error occurred while loading the fee heads');
      }
    });
  }

  // Utility function to create a button with a callback
  function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.className = `btn btn-sm ${className}`;
    button.textContent = text;
    button.onclick = onClick;
    return button;
  }

  function editFeeHead(currentName) {
    const newName = prompt("Edit Fee Head Name:", currentName);
    if (newName && newName !== currentName) {
      $.ajax({
        url: '../php/update_fee_head.php',
        type: 'POST',
        dataType: 'json',
        data: { oldName: currentName, newName },
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

  function deleteFeeHead(feeHeadName) {
    $.ajax({
      url: '../php/delete_fee_head.php',
      type: 'POST',
      dataType: 'json',
      data: { feeHeadName },
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
    const selectedClasses = getCheckedValues('class');
    const selectedMonths = getCheckedValues('month');
    const feeAmount = document.getElementById('feeAmount').value.trim();

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
            <button class="btn btn-sm btn-warning" onclick="editFeePlan(this)">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteFeePlan(this)">Delete</button>
          </td>
        `;
      });
    });

    feePlanForm.reset();
    updateAllMonthsCheckbox();
  });

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
  }

  window.editFeePlan = function(button) {
    const row = button.closest('tr');
    document.getElementById('feeHeadSelect').value = row.cells[1].textContent;
    document.getElementById('feeAmount').value = row.cells[3].textContent;

    updateCheckboxes('class', row.cells[0].textContent);
    updateCheckboxes('month', row.cells[2].textContent);

    row.remove();
  };

  window.deleteFeePlan = function(button) {
    button.closest('tr').remove();
  };

  function updateCheckboxes(name, value) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(checkbox => {
      checkbox.checked = checkbox.value === value;
    });
  }

  document.getElementById('selectAllMonths').addEventListener('change', function() {
    const isChecked = this.checked;
    document.querySelectorAll('input[name="month"]').forEach(cb => cb.checked = isChecked);
  });

  document.querySelectorAll('input[name="month"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateAllMonthsCheckbox);
  });

  function updateAllMonthsCheckbox() {
    const allMonthsCheckbox = document.getElementById('selectAllMonths');
    const monthCheckboxes = document.querySelectorAll('input[name="month"]');
    allMonthsCheckbox.checked = Array.from(monthCheckboxes).every(cb => cb.checked);
  }

  loadFeeHeads();
});
