document.addEventListener('DOMContentLoaded', function() {
  const feeHeadForm = document.getElementById('feeHeadForm');
  const feeHeadList = document.getElementById('feeHeadList');
  const feePlanForm = document.getElementById('createFeePlanForm');
  const feePlanTable = document.getElementById('feePlanBody');
  const feeHeadSelect = document.getElementById('feeHeadSelect');

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

  function loadFeeHeads() {
    $.ajax({
      url: '../php/fetch_fee_plan.php',
      type: 'GET',
      dataType: 'json',
      success: function(response) {
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
      error: function() {
        alert('An error occurred while loading the fee heads');
      }
    });
  }

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
        data: { oldName: currentName, newName: newName },
        success: function(response) {
          if (response.status === 'success') {
            loadFeeHeads();
          } else {
            alert('Error updating fee head: ' + response.message);
          }
        },
        error: function(xhr, status, error) {
          console.error("Error:", status, error);
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

  loadFeeHeads();
});
