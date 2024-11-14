document.addEventListener('DOMContentLoaded', function() {
  const feeHeadForm = document.getElementById('feeHeadForm');
  const feeHeadList = document.getElementById('feeHeadList');
  const feePlanForm = document.getElementById('createFeePlanForm');
  const feePlanTable = document.getElementById('feePlanBody');

  // Handle Fee Head Form Submission
  feeHeadForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const feeHeadName = document.getElementById('feeHeadName').value;

    // Validate input
    if (!feeHeadName) {
      alert('Please enter a fee head name');
      return;
    }

    // Send AJAX request to insert the Fee Head
    $.ajax({
      url: '../php/insert_fee_plan.php', // PHP file that handles the insertion
      type: 'POST',
      data: { feeHeadName: feeHeadName },
      success: function(response) {
        if (response.status === 'success') {
          // Clear the input field
          $('#feeHeadName').val('');
          // Reload the list of Fee Heads
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
      url: '../php/fetch_fee_plan.php', // PHP file to fetch fee heads
      type: 'GET',
      success: function(response) {
        feeHeadList.innerHTML = ''; // Clear existing list

        // Append the fee heads to the list
        response.data.forEach(function(feeHead) {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

          // Fee head name span
          const nameSpan = document.createElement('span');
          nameSpan.textContent = feeHead.name;

          // Edit and Delete buttons
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

          // Add to fee head dropdown
          const feeHeadSelect = document.getElementById('feeHeadSelect');
          const option = document.createElement('option');
          option.value = feeHead.name;
          option.textContent = feeHead.name;
          feeHeadSelect.appendChild(option);
        });
      },
      error: function() {
        alert('An error occurred while loading the fee heads');
      }
    });
  }

  // Initially load the Fee Heads
  loadFeeHeads();

  // Function to edit a fee head
  function editFeeHead(listItem, currentName) {
    const nameSpan = listItem.querySelector('span');
    const newName = prompt("Edit Fee Head Name:", currentName);

    if (newName && newName !== currentName) {
      nameSpan.textContent = newName;

      // Update dropdown option
      const feeHeadSelect = document.getElementById('feeHeadSelect');
      const optionToEdit = Array.from(feeHeadSelect.options).find(option => option.value === currentName);
      if (optionToEdit) {
        optionToEdit.value = newName;
        optionToEdit.textContent = newName;
      }
    }
  }

  // Function to delete a fee head
  function deleteFeeHead(listItem, feeHeadName) {
    listItem.remove();

    const feeHeadSelect = document.getElementById('feeHeadSelect');
    const optionToDelete = Array.from(feeHeadSelect.options).find(option => option.value === feeHeadName);
    if (optionToDelete) {
      optionToDelete.remove();
    }
  }

  // Handle Fee Plan Form Submission
  feePlanForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const feeHead = document.getElementById('feeHeadSelect').value;
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

// Function to delete a fee plan
function deleteFeePlan(button) {
  const row = button.closest('tr');
  row.remove();
}

// Function to select or deselect all months based on "All Months" checkbox
function selectAllMonths(checkbox) {
  document.querySelectorAll('input[name="month"]').forEach(cb => cb.checked = checkbox.checked);
}

// Add event listener to the "All Months" checkbox
document.getElementById('selectAllMonths').addEventListener('change', function() {
  selectAllMonths(this);
});

// Function to check the "All Months" checkbox based on individual month selections
function updateAllMonthsCheckbox() {
  const allMonthsCheckbox = document.getElementById('selectAllMonths');
  const monthCheckboxes = document.querySelectorAll('input[name="month"]');
  allMonthsCheckbox.checked = Array.from(monthCheckboxes).every(cb => cb.checked);
}

// Add event listeners to individual month checkboxes
document.querySelectorAll('input[name="month"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateAllMonthsCheckbox);
});
