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

      // Create a new list item for the fee head with Edit and Delete buttons
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

      // Fee head name span
      const nameSpan = document.createElement('span');
      nameSpan.textContent = feeHeadName;

      // Edit and Delete buttons
      const buttonGroup = document.createElement('div');
      const editButton = document.createElement('button');
      editButton.className = 'btn btn-sm btn-warning me-2';
      editButton.textContent = 'Edit';
      editButton.onclick = function() {
          editFeeHead(listItem);
      };

      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-sm btn-danger';
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function() {
          deleteFeeHead(listItem);
      };

      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);

      listItem.appendChild(nameSpan);
      listItem.appendChild(buttonGroup);

      // Append the new fee head to the list
      feeHeadList.appendChild(listItem);

      // Add the fee head to the dropdown for fee plans
      const feeHeadSelect = document.getElementById('feeHeadSelect');
      const option = document.createElement('option');
      option.value = feeHeadName;
      option.textContent = feeHeadName;
      feeHeadSelect.appendChild(option);

      // Reset the fee head form
      feeHeadForm.reset();
  });

  // Function to edit a fee head
  function editFeeHead(listItem) {
      const nameSpan = listItem.querySelector('span');
      const currentName = nameSpan.textContent;
      const newName = prompt("Edit Fee Head Name:", currentName);

      if (newName) {
          nameSpan.textContent = newName; // Update the name

          // Update the corresponding option in the feeHeadSelect dropdown
          const feeHeadSelect = document.getElementById('feeHeadSelect');
          const optionToEdit = Array.from(feeHeadSelect.options).find(option => option.value === currentName);
          if (optionToEdit) {
              optionToEdit.value = newName;
              optionToEdit.textContent = newName;
          }
      }
  }

  // Function to delete a fee head
  function deleteFeeHead(listItem) {
      const feeHeadName = listItem.querySelector('span').textContent;

      // Remove the list item from the DOM
      listItem.remove();

      // Remove the corresponding option from the feeHeadSelect dropdown
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

      // Validate input
      if (!feeHead || selectedClasses.length === 0 || selectedMonths.length === 0 || !feeAmount) {
          alert('Please fill all required fields');
          return;
      }

      // Add rows to the fee plan table for each selected class and month
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

      // Reset the fee plan form
      feePlanForm.reset();
  });
});

// Function to edit a fee plan
function editFeePlan(button) {
  const row = button.closest('tr');
  const feeHead = row.cells[1].textContent;
  const month = row.cells[2].textContent;
  const feeAmount = row.cells[3].textContent;

  // Set the form values for editing
  document.getElementById('feeHeadSelect').value = feeHead;
  document.getElementById('feeAmount').value = feeAmount;

  // Logic to select the appropriate classes and months
  const classes = Array.from(document.querySelectorAll('input[name="class"]'));
  classes.forEach(classCheckbox => {
      classCheckbox.checked = classCheckbox.value === row.cells[0].textContent;
  });

  const months = Array.from(document.querySelectorAll('input[name="month"]'));
  months.forEach(monthCheckbox => {
      monthCheckbox.checked = monthCheckbox.value === month;
  });

  // Remove the row for editing
  row.remove();
}

// Function to delete a fee plan
function deleteFeePlan(button) {
  const row = button.closest('tr');
  row.remove();
}

// Function to select or deselect all months based on "All Months" checkbox
function selectAllMonths(checkbox) {
  const monthCheckboxes = document.querySelectorAll('input[name="month"]');
  monthCheckboxes.forEach(cb => cb.checked = checkbox.checked);
}

// Add event listener to the "All Months" checkbox
document.getElementById('selectAllMonths').addEventListener('change', function() {
  selectAllMonths(this);
});

// Function to check the "All Months" checkbox based on individual month selections
function updateAllMonthsCheckbox() {
  const allMonthsCheckbox = document.getElementById('selectAllMonths');
  const monthCheckboxes = document.querySelectorAll('input[name="month"]');
  const allSelected = Array.from(monthCheckboxes).every(cb => cb.checked);
  allMonthsCheckbox.checked = allSelected;
}

// Add event listeners to individual month checkboxes
document.querySelectorAll('input[name="month"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateAllMonthsCheckbox);
});
