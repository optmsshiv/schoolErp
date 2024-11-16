document.addEventListener('DOMContentLoaded', function () {
  const feeHeadForm = document.getElementById('feeHeadForm');
  const feeHeadList = document.getElementById('feeHeadList');
  const feePlanForm = document.getElementById('createFeePlanForm');
  const feePlanTable = document.getElementById('feePlanBody');
  const feeHeadSelect = document.getElementById('feeHeadSelect');
  const selectAllCheckbox = document.getElementById('selectAllMonths');
  const classNameForm = document.getElementById('classNameForm');
  const classNameList = document.getElementById('classNameList');

  // Utility function to create buttons
  function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.className = `btn btn-sm ${className}`;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  }

  // Load Fee Heads
  function loadFeeHeads() {
    $.ajax({
      url: '../php/fetch_fee_plan.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        feeHeadList.innerHTML = '';
        feeHeadSelect.innerHTML = '';

        response.data.forEach(feeHead => {
          // Create Fee Head List Item
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

          const nameSpan = document.createElement('span');
          nameSpan.textContent = feeHead.fee_head_name;

          const buttonGroup = document.createElement('div');
          buttonGroup.appendChild(
            createButton('Edit', 'btn-warning me-2', () => editFeeHead(feeHead.fee_head_name))
          );
          buttonGroup.appendChild(
            createButton('Delete', 'btn-danger', () => deleteFeeHead(feeHead.fee_head_name))
          );

          listItem.append(nameSpan, buttonGroup);
          feeHeadList.appendChild(listItem);

          // Add to Fee Head Dropdown
          const option = document.createElement('option');
          option.value = feeHead.fee_head_name;
          option.textContent = feeHead.fee_head_name;
          feeHeadSelect.appendChild(option);
        });
      },
      error: function (xhr) {
        console.error('Error loading fee heads:', xhr.responseText);
        alert('An error occurred while loading fee heads.');
      }
    });
  }

  // Add Fee Head
  feeHeadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const feeHeadName = document.getElementById('feeHeadName').value.trim();

    if (!feeHeadName) {
      Swal.fire('Error', 'Please enter a fee head name!', 'error');
      return;
    }

    $.ajax({
      url: '../php/insert_fee_head.php',
      type: 'POST',
      dataType: 'json',
      data: { feeHeadName },
      success: function (response) {
        if (response.status === 'success') {
          Swal.fire('Success', 'Fee head added successfully.', 'success');
          document.getElementById('feeHeadName').value = '';
          loadFeeHeads();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: function (xhr) {
        console.error('Error adding fee head:', xhr.responseText);
        Swal.fire('Error', 'An unexpected error occurred.', 'error');
      }
    });
  });

  // Edit Fee Head
  function editFeeHead(currentName) {
    Swal.fire({
      title: 'Edit Fee Head Name',
      input: 'text',
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        const newName = result.value.trim();
        if (newName && newName !== currentName) {
          $.ajax({
            url: '../php/update_fee_head.php',
            type: 'POST',
            dataType: 'json',
            data: { oldName: currentName, newName },
            success: function (response) {
              if (response.status === 'success') {
                Swal.fire('Success', 'Fee head updated successfully.', 'success');
                loadFeeHeads();
              } else {
                Swal.fire('Error', response.message, 'error');
              }
            },
            error: function (xhr) {
              console.error('Error updating fee head:', xhr.responseText);
              Swal.fire('Error', 'An unexpected error occurred.', 'error');
            }
          });
        }
      }
    });
  }

  // Delete Fee Head
  function deleteFeeHead(feeHeadName) {
    Swal.fire({
      title: `Delete Fee Head: "${feeHeadName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        $.ajax({
          url: '../php/delete_fee_head.php',
          type: 'POST',
          dataType: 'json',
          data: { feeHeadName },
          success: function (response) {
            if (response.status === 'success') {
              Swal.fire('Deleted!', 'Fee head deleted successfully.', 'success');
              loadFeeHeads();
            } else {
              Swal.fire('Error', response.message, 'error');
            }
          },
          error: function (xhr) {
            console.error('Error deleting fee head:', xhr.responseText);
            Swal.fire('Error', 'An unexpected error occurred.', 'error');
          }
        });
      }
    });
  }

  // Add Class Name
  classNameForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const className = document.getElementById('className').value.trim();

    if (!className) {
      Swal.fire('Error', 'Please enter a class name!', 'error');
      return;
    }

    $.ajax({
      url: '../php/classes/insertClass.php',
      type: 'POST',
      dataType: 'json',
      data: { className },
      success: function (response) {
        if (response.status === 'success') {
          Swal.fire('Success', 'Class name added successfully.', 'success');
          document.getElementById('className').value = '';
          loadClassNames();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: function (xhr) {
        console.error('Error adding class:', xhr.responseText);
        Swal.fire('Error', 'An unexpected error occurred.', 'error');
      }
    });
  });

  // Load Class Names
  function loadClassNames() {
    $.ajax({
      url: '../php/classes/fetch_classes.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        classNameList.innerHTML = '';
        response.data.forEach(classItem => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

          const nameSpan = document.createElement('span');
          nameSpan.textContent = classItem.class_name;

          const buttonGroup = document.createElement('div');
          buttonGroup.appendChild(
            createButton('Delete', 'btn-danger', () => deleteClass(classItem.class_id))
          );

          listItem.append(nameSpan, buttonGroup);
          classNameList.appendChild(listItem);
        });
      },
      error: function (xhr) {
        console.error('Error loading class names:', xhr.responseText);
        Swal.fire('Error', 'An unexpected error occurred.', 'error');
      }
    });
  }

  // Delete Class
  function deleteClass(classId) {
    Swal.fire({
      title: 'Delete Class?',
      text: 'Do you want to delete this class?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        $.ajax({
          url: '../php/delete_class.php',
          type: 'POST',
          dataType: 'json',
          data: { classId },
          success: function (response) {
            if (response.status === 'success') {
              Swal.fire('Deleted!', 'Class deleted successfully.', 'success');
              loadClassNames();
            } else {
              Swal.fire('Error', response.message, 'error');
            }
          },
          error: function (xhr) {
            console.error('Error deleting class:', xhr.responseText);
            Swal.fire('Error', 'An unexpected error occurred.', 'error');
          }
        });
      }
    });
  }

  // Handle "Select All Months" checkbox
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function () {
      const monthCheckboxes = document.querySelectorAll('input[name="month"]');
      monthCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
      });
    });
  }

  // Initialize
  loadFeeHeads();
  loadClassNames();
});
