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
  const createButton = (text, className, onClick) => {
    const button = document.createElement('button');
    button.className = `btn btn-sm ${className}`;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  };

  // Generic error handler
  const handleError = (message, xhr) => {
    console.error(message, xhr?.responseText || '');
    Swal.fire('Error', message, 'error');
  };

  // Load Fee Heads
  const loadFeeHeads = () => {
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
          buttonGroup.append(
            createButton('Edit', 'btn-warning me-2', () => editFeeHead(feeHead.fee_head_name)),
            createButton('Delete', 'btn-danger', () => deleteFeeHead(feeHead.fee_head_name))
          );

          listItem.append(nameSpan, buttonGroup);
          feeHeadList.appendChild(listItem);

          // Add to Fee Head Dropdown
          const option = new Option(feeHead.fee_head_name, feeHead.fee_head_name);
          feeHeadSelect.add(option);
        });
      },
      error: xhr => handleError('Error loading fee heads.', xhr)
    });
  };

  // Add Fee Head
  feeHeadForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const feeHeadName = document.getElementById('feeHeadName').value.trim();

    if (!feeHeadName) {
      return Swal.fire('Error', 'Please enter a fee head name!', 'error');
    }

    $.ajax({
      url: '../php/insert_fee_head.php',
      type: 'POST',
      dataType: 'json',
      data: { feeHeadName },
      success: function (response) {
        if (response.status === 'success') {
          Swal.fire('Success', 'Fee head added successfully.', 'success');
          feeHeadForm.reset();
          loadFeeHeads();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: xhr => handleError('Error adding fee head.', xhr)
    });
  });

  // Edit Fee Head
  const editFeeHead = (currentName) => {
    Swal.fire({
      title: 'Edit Fee Head Name',
      input: 'text',
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
    }).then(result => {
      const newName = result.value?.trim();
      if (result.isConfirmed && newName && newName !== currentName) {
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
          error: xhr => handleError('Error updating fee head.', xhr)
        });
      }
    });
  };

  // Delete Fee Head
  const deleteFeeHead = (feeHeadName) => {
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
          error: xhr => handleError('Error deleting fee head.', xhr)
        });
      }
    });
  };

  // Add Class Name
  classNameForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const className = document.getElementById('className').value.trim();

    if (!className) {
      return Swal.fire('Error', 'Please enter a class name!', 'error');
    }

    $.ajax({
      url: '../php/classes/insertClass.php',
      type: 'POST',
      dataType: 'json',
      data: { className },
      success: function (response) {
        if (response.status === 'success') {
          Swal.fire('Success', 'Class name added successfully.', 'success');
          classNameForm.reset();
          loadClassNames();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: xhr => handleError('Error adding class.', xhr)
    });
  });

  // Load Class Names
  const loadClassNames = () => {
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

          const buttonGroup = createButton('Delete', 'btn-danger', () => deleteClass(classItem.class_id));
          listItem.append(nameSpan, buttonGroup);
          classNameList.appendChild(listItem);
        });
      },
      error: xhr => handleError('Error loading class names.', xhr)
    });
  };

  // Delete Class
  const deleteClass = (className) => {
    Swal.fire({
      title: 'Delete Class?',
      text: 'Do you want to delete this class?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        // Use correct parameter name for class_name
        $.ajax({
          url: '../php/classes/delete_class.php',
          type: 'POST',
          dataType: 'json',
          data: { class_name: className }, // Use class_name to match backend parameter
          success: function (response) {
            if (response.status === 'success') {
              Swal.fire('Deleted!', 'Class deleted successfully.', 'success');
              loadClassNames(); // Refresh the class list after deletion
            } else {
              Swal.fire('Error', response.message, 'error'); // Handle the error
            }
          },
          error: function (xhr, status, error) {
            // Handle AJAX errors
            let errorMessage = xhr.responseText ? xhr.responseText : error;
            Swal.fire('Error', `Error deleting class: ${errorMessage}`, 'error');
          }
        });
      }
    });
  };





  // Handle "Select All Months" checkbox
  selectAllCheckbox?.addEventListener('change', function () {
    const monthCheckboxes = document.querySelectorAll('input[name="month"]');
    monthCheckboxes.forEach(checkbox => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  // Initialize
  loadFeeHeads();
  loadClassNames();
});
