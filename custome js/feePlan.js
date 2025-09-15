document.addEventListener("DOMContentLoaded", function () {
  const feeHeadSelect = document.getElementById("feeHeadSelect");
  const classSelect = document.getElementById("classNameSelect");
  const monthsContainer = document.getElementById("monthsContainer");
  const monthDropdown = document.getElementById("monthDropdown");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const clearSelectionBtn = document.getElementById("clearSelectionBtn");

  // ---------------- Load FeeHeads, Classes, Months ----------------
  function loadFeeData() {
    fetch("../php/create_fee_plan.php")
      .then(res => res.json())
      .then(data => {
        // ---------------- Fee Heads ----------------
        feeHeadSelect.innerHTML = '<option value="">Select Fee Head</option>';
        data.FeeHeads.forEach(fh => {
          let option = document.createElement("option");
          option.value = fh.fee_head_name;      // ✅ correct ID field
          option.textContent = fh.fee_head_name;
          feeHeadSelect.appendChild(option);
        });

        // ---------------- Classes ----------------
        classSelect.innerHTML = '<option value="">Select Class</option>';
        data.Classes.forEach(c => {
          let option = document.createElement("option");
          option.value = c.class_name;          // ✅ correct ID field
          option.textContent = c.class_name;
          classSelect.appendChild(option);
        });

        // ---------------- Months ----------------
        const months = [
          "January","February","March","April","May","June",
          "July","August","September","October","November","December"
        ];
        monthsContainer.innerHTML = "";
        months.forEach(m => {
          let id = m.toLowerCase();
          monthsContainer.innerHTML += `
            <div class="form-check">
              <input type="checkbox" value="${m}" id="${id}" class="form-check-input month-checkbox" />
              <label class="form-check-label" for="${id}">${m}</label>
            </div>`;
        });
        // Re-bind events after months are rendered
        bindMonthEvents();
      });
  }

  // Toggle dropdown on click (but don’t hide when clicking inside)
  monthDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "none" ? "block" : "none";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!monthDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  // Select All functionality
  selectAllCheckbox.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".month-checkbox");
    checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    updateSelectAllState();
    updateMonthText();
  });

  // Bind month checkboxes events (called after rendering)
  function bindMonthEvents() {
    const monthCheckboxes = document.querySelectorAll(".month-checkbox");

    monthCheckboxes.forEach((checkbox) => {
      // Prevent dropdown from closing when clicking the checkbox itself
      checkbox.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      checkbox.addEventListener("change", function () {
        updateSelectAllState();
        updateMonthText();
      });
    });

    // Also prevent closing when clicking the labels
    document.querySelectorAll(".form-check-label").forEach((label) => {
      label.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });

    // Select All checkbox — same behavior (don’t close dropdown)
    const selectAllCheckbox = document.getElementById("selectAllCheckbox");
    selectAllCheckbox.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    selectAllCheckbox.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(".month-checkbox");
      checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
      updateSelectAllState();
      updateMonthText();
    });
  }


  // Update text on selection
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("month-checkbox")) {
      updateMonthText();
    }
  });

  // Clear Selection button
  clearSelectionBtn.addEventListener("click", function () {
    document.querySelectorAll(".month-checkbox").forEach(cb => cb.checked = false);
    selectAllCheckbox.checked = false;
    updateMonthText();
  });

  // Auto-update "Select All" checkbox based on individual selections
  // Auto-update "Select All" with indeterminate
  function updateSelectAllState() {
    const monthCheckboxes = document.querySelectorAll(".month-checkbox");
    const checkedCount = [...monthCheckboxes].filter(cb => cb.checked).length;

    if (checkedCount === monthCheckboxes.length && checkedCount > 0) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true; // show dash
    }
  }

  function updateMonthText() {
    const checked = Array.from(document.querySelectorAll(".month-checkbox:checked"))
      .map(cb => cb.value);

    let displayText = "Select Month(s)";

    if (checked.length > 0 && checked.length <= 3) {
      displayText = checked.join(", ");
    } else if (checked.length > 3) {
      displayText = `${checked.length} months selected`;
    }

    monthDropdown.childNodes[0].nodeValue = displayText;
  }

  loadFeeData(); // load when page starts

});

document.querySelector("#createFeePlanForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const feeHeadId = document.getElementById("feeHeadSelect").value;
  const classId = document.getElementById("classNameSelect").value;
  const feeAmount = document.getElementById("feeAmount").value;

  // Collect selected months
  const selectedMonths = Array.from(document.querySelectorAll(".month-checkbox:checked"))
    .map(cb => cb.value);

  if (!feeHeadId || !classId || selectedMonths.length === 0 || !feeAmount) {
    alert("Please fill all fields and select at least one month.");
    return;
  }

  fetch("../php/feePlan/insert_fee_plan.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fee_head_id: feeHeadId,
      class_id: classId,
      fee_amount: feeAmount,
      months: selectedMonths
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        showToast("Fee Plan Created Successfully!", "success");
        document.getElementById("createFeePlanForm").reset();
        document.getElementById("monthDropdown").childNodes[0].nodeValue = "Select Month(s)";

        loadFeePlans(); // ✅ Refresh the table after insert
      } else {
        showToast("Error: " + data.message, "error");
      }
    })
    .catch(err => {
      console.error("Error:", err);
      showToast("Something went wrong!", "error");
    });

  function showToast(message, type = "success") {
    const toastEl = document.getElementById("toastMessage");
    const toastBody = document.getElementById("toastBody");

    // Update message
    toastBody.textContent = message;

    // Change color based on type
    toastEl.classList.remove("bg-success", "bg-danger", "bg-warning", "bg-info");
    if (type === "success") toastEl.classList.add("bg-success");
    else if (type === "error") toastEl.classList.add("bg-danger");
    else if (type === "warning") toastEl.classList.add("bg-warning");
    else toastEl.classList.add("bg-info");

    // Show toast with auto-hide (3s)
    const toast = new bootstrap.Toast(toastEl, {
      delay: 3000, // 3 seconds
      autohide: true
    });
    toast.show();
  }
  // ---------------- Initial Loads ----------------

  loadFeePlans(); // ✅ Load existing plans when page starts

  // Function to load fee plan table
  function loadFeePlans() {
    fetch("../php/feePlan/fetch_fee_plans.php") // <-- Create this PHP file
      .then(res => res.json())
      .then(data => {
        const tableBody = document.getElementById("feePlanBody"); // tbody id
        tableBody.innerHTML = "";

        data.forEach(plan => {
          let row = `
          <tr>
            <td>${plan.fee_head_name}</td>
            <td>${plan.class_name}</td>
            <td>${plan.months}</td>
            <td>${plan.fee_amount}</td>
          </tr>
        `;
          tableBody.innerHTML += row;
        });
      })
      .catch(err => console.error("Error loading fee plans:", err));
  }

});

