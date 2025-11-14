document.addEventListener("DOMContentLoaded", function () {
  const feeHeadSelect = document.getElementById("feeHeadSelect");
  const classSelect = document.getElementById("classNameSelect");
  const monthsContainer = document.getElementById("monthsContainer");
  const monthDropdown = document.getElementById("monthDropdown");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  const clearSelectionBtn = document.getElementById("clearSelectionBtn");
  const tableBody = document.getElementById("feePlanBody"); // ✅ tbody of fee plan table
  const editModal = new bootstrap.Modal(document.getElementById("editFeePlanModal"));
  const editForm = document.getElementById("editFeePlanForm");

  const editFeePlanId = document.getElementById("editFeePlanId");
  const editClassSelect = document.getElementById("editClassSelect");
  const editFeeHeadSelect = document.getElementById("editFeeHeadSelect");
  const editMonth = document.getElementById("editMonth");
  const editAmount = document.getElementById("editAmount");

  // ✅ Fetch dropdown data once and store globally
  let dropdownData = { Classes: [], FeeHeads: [] };

  // ---------------- Load FeeHeads, Classes, Months ----------------
  function loadFeeData() {
    fetch("../php/create_fee_plan.php")
      .then(res => res.json())
      .then(data => {
        // ---------------- Fee Heads ----------------
        feeHeadSelect.innerHTML = '<option value="">Select Fee Head</option>';
        data.FeeHeads.forEach(fh => {
          let option = document.createElement("option");
          option.value = fh.fee_head_id;   // ✅ use ID, not name
          option.textContent = fh.fee_head_name; // show name
          feeHeadSelect.appendChild(option);
        });

        // ---------------- Classes ----------------
        classSelect.innerHTML = '<option value="">Select Class</option>';
        data.Classes.forEach(c => {
          let option = document.createElement("option");
          option.value = c.class_id;       // ✅ use ID, not name
          option.textContent = c.class_name; // show name
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
        bindMonthEvents();
      });
  }

  // ---------------- Load Fee Plan Table ----------------
  function loadFeePlans() {
    fetch("../php/feePlan/fetch_fee_plans.php")
      .then(res => res.json())
      .then(data => {
        tableBody.innerHTML = "";

        if (data.length === 0) {
          tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No Fee Plans Found</td></tr>`;
          return;
        }

        data.forEach(plan => {
          let row = `
            <tr>

            <td>${plan.class_name}</td>
            <td>${plan.fee_head_name}</td>
            <td>${plan.month_name}</td>
            <td>${plan.amount}</td>
            <td>${formatDateTime(plan.created_at)}</td>
            <td>${formatDateTime(plan.updated_at)}</td>
            <td>
                <a href="javascript:;" class="tf-icons bx bx-edit bx-sm text-warning edit-btn"
                        data-id="${plan.fee_plan_id}"
                        data-class="${plan.class_id}"
                        data-feehead="${plan.fee_head_id}"
                        data-month="${plan.month_name}"
                        data-amount="${plan.amount}">
                         </a>
                  <a href="javascript:;" class="tf-icons bx bx-trash bx-sm ms-2 text-danger delete-btn"
                        data-id="${plan.fee_plan_id}"></a>
            </td>
            </tr>
          `;
          tableBody.innerHTML += row;
        });
      })
      .catch(err => console.error("Error loading fee plans:", err));
  }

  // ---------------- Load Deleted Fee Plans ----------------
  function loadDeletedFeePlans() {
    fetch("../php/feePlan/fetch_deleted_fee_plans.php")
      .then(res => res.json())
      .then(data => {
        const deletedBody = document.getElementById("deletedFeePlanBody");
        deletedBody.innerHTML = "";

        if (data.length === 0) {
          deletedBody.innerHTML = `<tr><td colspan="6" class="text-center">No Deleted Fee Plans</td></tr>`;
          return;
        }

        data.forEach(plan => {
          let row = `
          <tr>
            <td>${plan.class_name}</td>
            <td>${plan.fee_head_name}</td>
            <td>${plan.month_name}</td>
            <td>${plan.amount}</td>
            <td>${formatDateTime(plan.deleted_at)}</td>
            <td></td>
            <td>
              <button class="btn btn-sm btn-outline-success restore-btn"
                      data-id="${plan.fee_plan_id}">
                Restore
              </button>
            </td>
          </tr>`;
          deletedBody.innerHTML += row;
        });
      })
      .catch(err => console.error("Error loading deleted plans:", err));
  }

    // ------------- function format date and time --------------
  function formatDateTime(dt) {
    if (!dt) return "-";
    const d = new Date(dt);
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }

  // ---------------- Edit Modal  ---------------

  function loadDropdowns() {
    return fetch("../php/create_fee_plan.php")
      .then(res => res.json())
      .then(data => {
        dropdownData = data; // store for later
      });
  }

  function populateEditDropdowns(selectedClassId, selectedFeeHeadId) {
    // Populate Classes
    editClassSelect.innerHTML = '<option value="">Select Class</option>';
    dropdownData.Classes.forEach(c => {
      const option = document.createElement("option");
      option.value = c.class_id;
      option.textContent = c.class_name;
      if (parseInt(c.class_id) === parseInt(selectedClassId)) option.selected = true;
      editClassSelect.appendChild(option);
    });

    // Populate Fee Heads
    editFeeHeadSelect.innerHTML = '<option value="">Select Fee Head</option>';
    dropdownData.FeeHeads.forEach(fh => {
      let option = document.createElement("option");
      option.value = fh.fee_head_id;
      option.textContent = fh.fee_head_name;
      if (parseInt(fh.fee_head_id) === parseInt(selectedFeeHeadId)) option.selected = true;
      editFeeHeadSelect.appendChild(option);
    });
  }

  // Attach click handler for Edit buttons
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const btn = e.target;

      console.log("🔎 Edit button clicked →", {
        id: btn.dataset.id,
        classId: btn.dataset.class,
        feeHeadId: btn.dataset.feehead,
        month: btn.dataset.month,
        amount: btn.dataset.amount,
      });

      // Fill form fields
      editFeePlanId.value = btn.dataset.id;
      editMonth.value = btn.dataset.month;
      editAmount.value = btn.dataset.amount;

      // Populate dropdowns with pre-selected values
      populateEditDropdowns(btn.dataset.class, btn.dataset.feehead);

      editModal.show();
    }
  });

  // ----- Handle update submit ----------
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      fee_plan_id: editFeePlanId.value,
      class_id: editClassSelect.value,
      fee_head_id: editFeeHeadSelect.value,
      month_name: editMonth.value,
      fee_amount: editAmount.value
    };

    fetch("../php/feePlan/update_fee_plan.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          alert("Updated successfully ✅");
          editModal.hide();
          loadFeePlans(); // reload table
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(err => console.error("Update failed:", err));
  });


  // ----- Delete Logic ----------------
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const feePlanId = e.target.dataset.id;

      if (!confirm("Are you sure you want to delete this fee plan?")) return;

      fetch("../php/feePlan/delete_fee_plan.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee_plan_id: feePlanId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            showToast("Fee Plan deleted successfully!", "success");
            loadFeePlans(); // ✅ Refresh table after delete
          } else {
            showToast("Error: " + data.message, "error");
          }
        })
        .catch(err => {
          console.error("Delete failed:", err);
          showToast("Something went wrong while deleting!", "error");
        });
    }
  });


  // ----- Restore Logic ----------------
  document.getElementById("deletedFeePlanBody").addEventListener("click", (e) => {
    if (e.target.classList.contains("restore-btn")) {
      const id = e.target.dataset.id;
      if (!confirm("Restore this fee plan?")) return;

      fetch("../php/feePlan/restore_fee_plan.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee_plan_id: id })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            showToast("Fee Plan restored successfully!", "success");
            loadFeePlans();        // refresh active table
            loadDeletedFeePlans(); // refresh deleted table
          } else {
            showToast("Error: " + data.message, "error");
          }
        })
        .catch(err => console.error("Restore failed:", err));
    }
  });

  // ---- reload the deleted tab table when open ----
  document.getElementById("deleted-tab").addEventListener("shown.bs.tab", () => {
    loadDeletedFeePlans();
  });



  // ---------------- Month Dropdown Logic ----------------
  monthDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", function (e) {
    if (!monthDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  selectAllCheckbox.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".month-checkbox");
    checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    updateSelectAllState();
    updateMonthText();
  });

  function bindMonthEvents() {
    const monthCheckboxes = document.querySelectorAll(".month-checkbox");

    monthCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      checkbox.addEventListener("change", function () {
        updateSelectAllState();
        updateMonthText();
      });
    });

    document.querySelectorAll(".form-check-label").forEach((label) => {
      label.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });

    selectAllCheckbox.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  clearSelectionBtn.addEventListener("click", function () {
    document.querySelectorAll(".month-checkbox").forEach(cb => cb.checked = false);
    selectAllCheckbox.checked = false;
    updateMonthText();
  });

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
      selectAllCheckbox.indeterminate = true;
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

  // ---------------- Form Submit ----------------
  document.querySelector("#createFeePlanForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const feeHeadId = document.getElementById("feeHeadSelect").value;
    const classId = document.getElementById("classNameSelect").value;
    const feeAmount = document.getElementById("feeAmount").value;

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
        months: selectedMonths,
        fee_amount: feeAmount
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          showToast("Fee Plan Created Successfully!", "success");
          document.getElementById("createFeePlanForm").reset();
          document.getElementById("monthDropdown").childNodes[0].nodeValue = "Select Month(s)";
          loadFeePlans(); // ✅ Refresh table here
        } else {
          showToast("Error: " + data.message, "error");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        showToast("Something went wrong!", "error");
      });
  });

  // ---------------- Toast ----------------
  function showToast(message, type = "success") {
    const toastEl = document.getElementById("toastMessage");
    const toastBody = document.getElementById("toastBody");

    toastBody.textContent = message;

    toastEl.classList.remove("bg-success", "bg-danger", "bg-warning", "bg-info");
    if (type === "success") toastEl.classList.add("bg-success");
    else if (type === "error") toastEl.classList.add("bg-danger");
    else if (type === "warning") toastEl.classList.add("bg-warning");
    else toastEl.classList.add("bg-info");

    const toast = new bootstrap.Toast(toastEl, { delay: 3000, autohide: true });
    toast.show();
  }

  // ---------------- Initial Loads ----------------
  loadFeeData();
  loadFeePlans(); // ✅ Load existing plans when page starts
  loadDeletedFeePlans(); // Load deleted fee plan when page starts
  loadDropdowns(); // ✅ Load dropdown data when page loads
});
