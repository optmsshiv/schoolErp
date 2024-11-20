document.addEventListener('DOMContentLoaded', function () {
  const feeHeadForm = document.getElementById('feeHeadForm');
  const feeHeadList = document.getElementById('feeHeadList');
  const feePlanForm = document.getElementById('feePlanForm');
  const feePlanTable = document.getElementById('feePlanBody');
  const feeHeadSelect = document.getElementById('feeHeadSelect');
  const classNameSelect = document.getElementById('classNameSelect')
  const classNameForm = document.getElementById('classNameForm');
  const classNameList = document.getElementById('classNameList');

  const dropdown = document.getElementById("monthDropdown");
  const dropdownMenu = dropdown.querySelector(".dropdown-menu");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const monthCheckboxes = document.querySelectorAll(".month-checkbox");


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
    const month = Array.from(document.getElementById('monthDropdown').getElementsByClassName('month-checkbox'))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);
    const amount = document.getElementById('feeAmount').value.trim();

    // Validate form fields
    if (!feeHead || !className || !month.length || !amount) {
      return Swal.fire('Error', 'Please fill all fields!', 'error');
    }

    // Validate amount (should be a number and greater than 0)
    if (isNaN(amount) || parseInt(amount) <= 0) {
      return Swal.fire('Error', 'Please enter a valid amount!', 'error');
    }

    console.log({ feeHead, className, month, amount }); // Debugging

    // Prepare data for the AJAX request
    const data = {
      feeHead: feeHead,
      className: className,
      month: month.join(','),  // Convert array to comma-separated string
      amount: amount
    };

    // AJAX call
    $.ajax({
      url: '../php/feePlan/insert_fee_plan.php',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',  // Set content type to JSON
      data: JSON.stringify(data),  // Send data as a JSON string
      success: function (response) {
        console.log(response); // Log the response for debugging
        if (response.status === 'success') {
          Swal.fire('Success', 'Fee plan added successfully.', 'success');
          feePlanForm.reset();  // Reset form
          loadFeePlans();  // Reload fee plans (if applicable)
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: function (xhr, status, error) {
        console.error(`AJAX Error: ${status}, ${error}`);
        console.error("Response Text: ", xhr.responseText);
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

        if (response.data.length === 0) {
          // If no data, show a message row
          const row = document.createElement('tr');
          const messageCell = document.createElement('td');
          messageCell.colSpan = 6; // Span across all columns
          messageCell.textContent = 'Data not available';
          row.appendChild(messageCell);
          feePlanTable.appendChild(row);
        } else {
          // If data is available, populate the table
          response.data.forEach(plan => {
            const row = document.createElement('tr');

            row.innerHTML = `
              <td>${plan.fee_plan_id}</td>
              <td>${plan.class_name}</td>
              <td>${plan.fee_head_name}</td>
              <td>${plan.month_name}</td>
              <td>${plan.amount}</td>
              <td>${plan.created_at}</td>
              <td>${plan.updated_at}</td>
            `;

            // Create Edit and Delete buttons
            const actionCell = document.createElement('td');
            actionCell.append(
              createButton('Edit', 'btn-warning me-2', () => editFeePlan(plan.id)),
              createButton('Delete', 'btn-danger', () => deleteFeePlan(plan.class_name))
            );

            // Append action buttons to the row
            row.appendChild(actionCell);
            feePlanTable.appendChild(row);
          });
        }
      },
      error: xhr => handleError('Error loading fee plans.', xhr)
    });
  };

  // Update Fee Plan
  const editFeePlan = (planId) => {
    console.log('Editing fee plan with ID:', planId); // Log the planId to confirm it's correct
    $.ajax({
        url: '../php/feePlan/fetch_fee_plans.php',
        type: 'GET',
        data: { planId: planId },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success' && response.data) {
                const feePlan = response.data[0]; // Access the first item if data is an array

                console.log(feePlan); // Log feePlan data to inspect

                // Handle missing or undefined month_name gracefully
                const monthNames = feePlan.month_name ? feePlan.month_name.split(',') : [];

                Swal.fire({
                    title: 'Edit Fee Plan',
                    html: `
                        <label>Class Name</label>
                        <select id="editClassName" class="swal2-select">
                            ${Array.from(classNameSelect.options).map(option => `
                                <option value="${option.value}" ${option.value === feePlan.class_name ? 'selected' : ''}>
                                    ${option.text}
                                </option>
                            `).join('')}
                        </select>
                        <label>Fee Head Name</label>
                        <select id="editFeeHead" class="swal2-select">
                            ${Array.from(feeHeadSelect.options).map(option => `
                                <option value="${option.value}" ${option.value === feePlan.fee_head_name ? 'selected' : ''}>
                                    ${option.text}
                                </option>
                            `).join('')}
                        </select>
                        <label>Month Name</label>
                        <div id="editMonthOptions">
                            ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                                .map(month => `
                                    <label>
                                        <input type="checkbox" class="swal2-checkbox" value="${month}" ${monthNames.includes(month) ? 'checked' : ''} />
                                        ${month}
                                    </label><br>
                                `).join('')}
                        </div>
                        <label>Amount</label>
                        <input id="editAmount" class="swal2-input" type="number" value="${feePlan.amount}">
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    cancelButtonText: 'Cancel',
                    preConfirm: () => {
                        const className = document.getElementById('editClassName').value.trim();
                        const feeHead = document.getElementById('editFeeHead').value.trim();
                        const amount = document.getElementById('editAmount').value.trim();

                        const selectedMonths = Array.from(document.querySelectorAll('#editMonthOptions input[type="checkbox"]:checked'))
                            .map(checkbox => checkbox.value);

                        if (!className || !feeHead || !amount || selectedMonths.length === 0) {
                            Swal.showValidationMessage('All fields are required!');
                            return false;
                        }

                        return { className, feeHead, selectedMonths, amount };
                    }
                });
            } else {
                Swal.fire('Error', response.message || 'Fee plan not found.', 'error');
            }
        },
        error: function(xhr) {
            console.error('Error fetching fee plan details:', xhr);
            Swal.fire('Error', 'Error fetching data from the server.', 'error');
        }
    });
};




  // Delete Fee Plan
  const deleteFeePlan = (class_name) => {
    Swal.fire({
        title: 'Delete Fee Plan?',
        text: `Are you sure you want to delete the fee plan for class "${class_name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        timer: 10000, // Add a timer (in milliseconds)
        timerProgressBar: true, // Show a timer progress bar
        allowOutsideClick: false, // Prevent closing the alert by clicking outside
        allowEscapeKey: false // Prevent closing the alert using the escape key
    }).then(result => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../php/feePlan/delete_fee_plan.php',
                type: 'POST',
                dataType: 'json',
                data: { class_name: class_name },
                success: function (response) {
                    if (response.status === 'success') {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Fee plan deleted successfully.',
                            icon: 'success',
                            timer: 3000, // Auto close after 3 seconds
                            timerProgressBar: true,
                        });
                        loadFeePlans(); // Reload the fee plans
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: response.message,
                            icon: 'error',
                            timer: 5000, // Auto close after 5 seconds
                            timerProgressBar: true,
                        });
                    }
                },
                error: (xhr, textStatus, errorThrown) => {
                    Swal.fire({
                        title: 'Error',
                        text: `An error occurred: ${xhr.statusText || textStatus}`,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });
};


  // Handle "Select All Months" checkbox
  // Toggle dropdown visibility when clicking the select element
  dropdown.addEventListener("click", function (event) {
    // Prevent the click from closing the dropdown
    event.stopPropagation();

    // Toggle dropdown visibility only if the dropdown is not already visible
    if (dropdownMenu.style.display === "none" || dropdownMenu.style.display === "") {
      dropdownMenu.style.display = "block";
    }
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", function (event) {
    // Close the dropdown only if the click is outside the dropdown or the select element
    if (!dropdown.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  // "Select All" behavior
  selectAllCheckbox.addEventListener("change", function () {
    const isChecked = selectAllCheckbox.checked;
    monthCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  });

  // Update "Select All" based on individual checkboxes
  monthCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const allChecked = Array.from(monthCheckboxes).every((cb) => cb.checked);
      selectAllCheckbox.checked = allChecked;

      // Set indeterminate state if some are selected
      const someChecked = Array.from(monthCheckboxes).some((cb) => cb.checked);
      selectAllCheckbox.indeterminate = someChecked && !allChecked;
    });
  });

  // Initialize
  loadFeeHeads();
  loadClassNames();
  loadFeePlans();
});
