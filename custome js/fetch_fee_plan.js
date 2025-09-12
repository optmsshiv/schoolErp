document.addEventListener("DOMContentLoaded", function () {
  const feePlanBody = document.getElementById("feePlanBody");

  const editFeePlanModal = new bootstrap.Modal(document.getElementById("editFeePlanModal"));
  const editForm = document.getElementById("editFeePlanForm");
  const editFeePlanId = document.getElementById("editFeePlanId");
  const editClassSelect = document.getElementById("editClassSelect");
  const editFeeHeadSelect = document.getElementById("editFeeHeadSelect");
  const editFeeAmount = document.getElementById("editFeeAmount");
  const editMonthsContainer = document.getElementById("editMonthsContainer");

  // Load dropdown options (same as create form)
  function loadDropdownOptions() {
    fetch("../php/create_fee_plan.php")
      .then(res => res.json())
      .then(data => {
        // Fee Heads
        editFeeHeadSelect.innerHTML = '<option value="">Select Fee Head</option>';
        data.feeheads.forEach(fh => {
          let opt = document.createElement("option");
          opt.value = fh.id;
          opt.textContent = fh.fee_head_name;
          editFeeHeadSelect.appendChild(opt);
        });

        // Classes
        editClassSelect.innerHTML = '<option value="">Select Class</option>';
        data.classes.forEach(c => {
          let opt = document.createElement("option");
          opt.value = c.id;
          opt.textContent = c.class_name;
          editClassSelect.appendChild(opt);
        });

        // Months
        const months = ["January","February","March","April","May","June",
          "July","August","September","October","November","December"];
        editMonthsContainer.innerHTML = "";
        months.forEach(m => {
          let id = "edit-" + m.toLowerCase();
          editMonthsContainer.innerHTML += `
            <div class="form-check form-check-inline">
              <input type="checkbox" value="${m}" id="${id}" class="form-check-input edit-month">
              <label for="${id}" class="form-check-label">${m}</label>
            </div>
          `;
        });
      });
  }

  // Load fee plans in table
  function loadFeePlans() {
    fetch("../php/feePlan/fetch_fee_plans.php")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          feePlanBody.innerHTML = "";
          data.data.forEach(plan => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${plan.fee_plan_id}</td>
              <td>${plan.class_name}</td>
              <td>${plan.fee_head_name}</td>
              <td>${plan.month_name}</td>
              <td>${plan.amount}</td>
              <td>${plan.created_at}</td>
              <td>${plan.updated_at}</td>
              <td>
                <button class="btn btn-sm btn-warning edit-btn"
                        data-id="${plan.id}"
                        data-class="${plan.class_id}"
                        data-feehead="${plan.fee_head_id}"
                        data-month="${plan.month_name}"
                        data-amount="${plan.amount}">
                        Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${plan.id}">Delete</button>
              </td>
            `;
            feePlanBody.appendChild(tr);
          });

          attachTableEvents();
        }
      });
  }

  // Attach actions
  function attachTableEvents() {
    // Delete
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = this.dataset.id;
        if (confirm("Delete this fee plan?")) {
          fetch("../php/feePlan/delete_fee_plan.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "id=" + id
          })
            .then(res => res.json())
            .then(resp => {
              alert(resp.message);
              loadFeePlans();
            });
        }
      });
    });

    // Edit
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        loadDropdownOptions(); // reload options fresh

        editFeePlanId.value = this.dataset.fee_head_id;
        editFeeAmount.value = this.dataset.amount;

        // Delay a bit so dropdowns are populated before setting values
        setTimeout(() => {
          editClassSelect.value = this.dataset.class;
          editFeeHeadSelect.value = this.dataset.feehead;

          // set months
          let months = this.dataset.month.split(",");
          document.querySelectorAll(".edit-month").forEach(cb => {
            cb.checked = months.includes(cb.value);
          });
        }, 300);

        editFeePlanModal.show();
      });
    });
  }

  // Handle update form
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const payload = {
      id: editFeePlanId.value,
      class_id: editClassSelect.value,
      fee_head_id: editFeeHeadSelect.value,
      fee_amount: editFeeAmount.value,
      month_name: Array.from(document.querySelectorAll(".edit-month:checked")).map(cb => cb.value).join(",")
    };

    fetch("../php/feePlan/update_fee_plan.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(resp => {
        alert(resp.message);
        editFeePlanModal.hide();
        loadFeePlans();
      });
  });

  // Init
  loadFeePlans();
});
