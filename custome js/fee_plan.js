document.addEventListener('DOMContentLoaded', function () {
  const feeHeadForm = document.getElementById('feeHeadForm');
  const feeHeadList = document.getElementById('feeHeadList');
  const feePlanForm = document.getElementById('feePlanForm');
  const feePlanTable = document.getElementById('feePlanBody');
  const feeHeadSelect = document.getElementById('feeHeadSelect');
  const classNameSelect = document.getElementById('classNameSelect')
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
      url: '../php/fetch_fee_head.php',
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
        classNameSelect.innerHTML = '';

        response.data.forEach(classItem => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

          const nameSpan = document.createElement('span');
          nameSpan.textContent = classItem.class_name;

          // Button Group (Edit and Delete)
          const buttonGroup = document.createElement('div');
          buttonGroup.append(
            createButton('Edit', 'btn-warning me-2', () => editClassName(classItem.class_name, classItem.class_id)),
            createButton('Delete', 'btn-danger', () => deleteClass(classItem.class_name))
          );

          listItem.append(nameSpan, buttonGroup);
          classNameList.appendChild(listItem);

          // Add class names to dropdown
          const option = new Option(classItem.class_name, classItem.class_name);
          classNameSelect.add(option);

        });
      },
      error: xhr => handleError('Error loading class names.', xhr)
    });
  };

  // Edit Class Name
  const editClassName = (currentName, classId) => {
    Swal.fire({
      title: 'Edit Class Name',
      input: 'text',
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
    }).then(result => {
      const newName = result.value?.trim();
      if (result.isConfirmed && newName && newName !== currentName) {
        $.ajax({
          url: '../php/classes/update_class.php',
          type: 'POST',
          dataType: 'json',
          data: { classId, newName },
          success: function (response) {
            if (response.status === 'success') {
              Swal.fire('Success', 'Class name updated successfully.', 'success');
              loadClassNames(); // Reload class names
            } else {
              Swal.fire('Error', response.message, 'error');
            }
          },
          error: xhr => handleError('Error updating class name.', xhr)
        });
      }
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


  // Add Fee Plan
  feePlanForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form field values
    const feeHead = document.getElementById('feeHeadSelect').value.trim();
    const className = document.getElementById('classNameSelect').value.trim();
    const month = Array.from(document.getElementById('month').selectedOptions).map(option => option.value);
    const amount = document.getElementById('feeAmount').value.trim();

    if (!feeHead || !className || !month.length || !amount) {
      return Swal.fire('Error', 'Please fill all fields!', 'error');
    }

      // Prepare data for the AJAX request
      const data = {
        feeHead: feeHead,
        className: className,
        month: month.join(','), // Convert array to comma-separated string
        feeAmount: amount
      };

    $.ajax({
      url: '../php/feePlan/insert_fee_plan.php',
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.status === 'success') {
          Swal.fire('Success', 'Fee plan added successfully.', 'success');
          feePlanForm.reset();
          loadFeePlans(); // Call a function to reload the fee plans (if applicable)
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: function (xhr, status, error) {
        console.error(`Error: ${error}, Status: ${status}`, xhr.responseText);
        Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
      }
    });
  });


  // Fetch and display fee plans
  const loadFeePlans = () => {
    $.ajax({
      url: '../php/feePlan/fetch_fee_plans.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        feePlanTable.innerHTML = ''; // Clear existing table content
        response.data.forEach(plan => {
          const row = document.createElement('tr');

          row.innerHTML = `
            <td>${plan.fee_head_name}</td>
            <td>${plan.class_name}</td>
            <td>${plan.month_name}</td>
            <td>${plan.amount}</td>
            <td>${plan.created_at}</td>
          `;

          // Create Edit and Delete buttons
          const actionCell = document.createElement('td');
          actionCell.append(
            createButton('Edit', 'btn-warning me-2', () => editFeePlan(plan.id)),
            createButton('Delete', 'btn-danger', () => deleteFeePlan(plan.id))
          );

          // Append action buttons to the row
          row.appendChild(actionCell);
          feePlanTable.appendChild(row);
        });
      },
      error: xhr => handleError('Error loading fee plans.', xhr)
    });
  };

  // Edit Fee Plan
  const editFeePlan = (plan) => {
    Swal.fire({
      title: 'Edit Fee Plan',
      html: `
        <input id="editFeeHead" class="swal2-input" value="${plan.fee_head_name}">
        <input id="editClassName" class="swal2-input" value="${plan.class_name}">
        <input id="editMonths" class="swal2-input" value="${plan.months.join(', ')}">
        <input id="editAmount" class="swal2-input" value="${plan.amount}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        const newPlan = {
          feeHead: document.getElementById('editFeeHead').value.trim(),
          className: document.getElementById('editClassName').value.trim(),
          months: document.getElementById('editMonths').value.split(',').map(m => m.trim()),
          amount: document.getElementById('editAmount').value.trim(),
        };

        $.ajax({
          url: '../php/update_fee_plan.php',
          type: 'POST',
          dataType: 'json',
          data: { id: plan.id, ...newPlan },
          success: function (response) {
            if (response.status === 'success') {
              Swal.fire('Success', 'Fee plan updated successfully.', 'success');
              loadFeePlans();
            } else {
              Swal.fire('Error', response.message, 'error');
            }
          },
          error: xhr => handleError('Error updating fee plan.', xhr)
        });
      }
    });
  };

  // Delete Fee Plan
  const deleteFeePlan = (id) => {
    Swal.fire({
      title: 'Delete Fee Plan?',
      text: 'Are you sure you want to delete this fee plan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        $.ajax({
          url: '../php/delete_fee_plan.php',
          type: 'POST',
          dataType: 'json',
          data: { id },
          success: function (response) {
            if (response.status === 'success') {
              Swal.fire('Deleted!', 'Fee plan deleted successfully.', 'success');
              loadFeePlans();
            } else {
              Swal.fire('Error', response.message, 'error');
            }
          },
          error: xhr => handleError('Error deleting fee plan.', xhr)
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
  loadFeePlans();
});
