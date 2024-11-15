document.addEventListener('DOMContentLoaded', function () {
  const feeHeadForm = document.getElementById('feeHeadForm');
  const feeHeadList = document.getElementById('feeHeadList');
  const feePlanForm = document.getElementById('createFeePlanForm');
  const feePlanTable = document.getElementById('feePlanBody');
  const feeHeadSelect = document.getElementById('feeHeadSelect');
  const selectAllCheckbox = document.getElementById('selectAllMonths');

  // Event listener for adding fee heads
  feeHeadForm.addEventListener('submit', function (e) {
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
      success: function (response) {
        if (response.status === 'success') {
          $('#feeHeadName').val('');
          loadFeeHeads();
        } else {
          alert('Error: ' + response.message);
        }
      },
      error: function () {
        alert('An error occurred while processing the request');
      }
    });
  });

  // Function to load fee heads
  function loadFeeHeads() {
    $.ajax({
      url: '../php/fetch_fee_plan.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        feeHeadList.innerHTML = '';
        feeHeadSelect.innerHTML = '';

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
      error: function () {
        alert('An error occurred while loading the fee heads');
      }
    });
  }

  // Function to create buttons
  function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.className = `btn btn-sm ${className}`;
    button.textContent = text;
    button.onclick = onClick;
    return button;
  }

  // Function to edit fee heads
  function editFeeHead(currentName) {
    const newName = prompt("Edit Fee Head Name:", currentName);
    if (newName && newName !== currentName) {
      $.ajax({
        url: '../php/update_fee_head.php',
        type: 'POST',
        dataType: 'json',
        data: { oldName: currentName, newName: newName },
        success: function (response) {
          if (response.status === 'success') {
            loadFeeHeads();
          } else {
            alert('Error updating fee head: ' + response.message);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error:", status, error);
          alert('An error occurred while updating the fee head');
        }
      });
    }
  }

  // Function to delete fee heads
  function deleteFeeHead(feeHeadName) {
    // Validate if the fee head name is provided
    if (!feeHeadName) {
      alert('Fee head name is required');
      return;
    }

    // Confirm the deletion action with the user
    if (confirm(`Are you sure you want to delete the fee head "${feeHeadName}"?`)) {
      $.ajax({
        url: '../php/delete_fee_head.php', // Path to your PHP delete script
        type: 'POST',  // Method type
        dataType: 'json',  // Expecting a JSON response
        data: { feeHeadName: feeHeadName }, // Data to be sent to the server
        success: function (response) {
          if (response.status === 'success') {
            alert('Fee head deleted successfully');
            loadFeeHeads(); // Reload fee heads after successful deletion
          } else {
            alert('Error deleting fee head: ' + response.message);  // Show the error message from the server
          }
        },
        error: function (xhr, status, error) {
          // Log the error to the console for debugging
          console.error('AJAX Error:', error, xhr.responseText);
          alert('An unexpected error occurred while deleting the fee head');  // Generic error message for the user
        }
      });
    }
  }



  // Function to handle "Select All Months"
  function selectAllMonths(selectAllCheckbox) {
    const monthCheckboxes = document.querySelectorAll('input[name="month"]');
    monthCheckboxes.forEach(checkbox => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  }

  // Attach the selectAllMonths function to the checkbox
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function () {
      selectAllMonths(selectAllCheckbox);
    });
  }

  // Load fee heads on page load
  loadFeeHeads();
});
