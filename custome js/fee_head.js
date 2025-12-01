document.getElementById("feeHeadForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let feeHeadName = document.getElementById("feeHeadName").value;
  let feeType = document.getElementById("feeType").value;

  fetch("../php/insert_fee_head.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "feeHeadName=" + encodeURIComponent(feeHeadName) +
      "&feeType=" + encodeURIComponent(feeType)
  })
    .then(res => res.json())
    .then(data => {
      let msgDiv = document.getElementById("resultMsg");
      msgDiv.innerHTML = `<div class="alert alert-${data.status}">${data.message}</div>`;

      // Hide after 3 seconds
      setTimeout(() => {
        msgDiv.innerHTML = "";
      }, 3000);

      if (data.status === "success") {
        document.getElementById("feeHeadForm").reset();
        fetchFeeHeads(); // Refresh list after adding
        // Highlight last inserted row
        setTimeout(() => {
          let firstRow = document.querySelector("#feeHeadTable tbody tr"); // since we fetch ORDER BY DESC
          if (firstRow) {
            firstRow.classList.add("highlight-row");
            setTimeout(() => firstRow.classList.remove("highlight-row"), 2000);
          }
        }, 300);
      }
    })
    .catch(err => console.error(err));
});
// Load fee heads when page loads
window.onload = fetchFeeHeads;
// Fetch and display all fee heads
function fetchFeeHeads() {
  fetch("../php/fetch_fee_head.php")
    .then(res => res.json())
    .then(data => {
      let tbody = document.querySelector("#feeHeadTable tbody");
      tbody.innerHTML = "";
      if (data.length > 0) {
        data.forEach((row, index) => {
          tbody.innerHTML += `
            <tr data-id="${row.fee_head_id}">
              <td>${index + 1}</td>
              <td>${row.fee_head_name}</td>
              <td>
                <button class="btn btn-sm btn-warning" onclick="openEditModal(${row.fee_head_id}, '${row.fee_head_name}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteFeeHead(${row.fee_head_id})">Delete</button>
              </td>
            </tr>`;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="2" class="text-center">No Fee Heads Found</td></tr>`;
      }
    })
    .catch(err => console.error(err));
}

 // Open Edit Modal & Submit Update
function openEditModal(id, name) {
  document.getElementById("editFeeHeadId").value = id;
  document.getElementById("editFeeHeadName").value = name;
  let modal = new bootstrap.Modal(document.getElementById("editFeeHeadModal"));
  modal.show();
}

// Handle Edit Form Submit
document.getElementById("editFeeHeadForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let id = document.getElementById("editFeeHeadId").value;
  let name = document.getElementById("editFeeHeadName").value;

  fetch("../php/update_fee_head.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "fee_head_id=" + encodeURIComponent(id) + "&feeHeadName=" + encodeURIComponent(name)
  })
    .then(res => res.json())
    .then(data => {
      let msgDiv = document.getElementById("resultMsg");
      msgDiv.innerHTML = `<div class="alert alert-${data.status}">${data.message}</div>`;
      setTimeout(() => { msgDiv.innerHTML = ""; }, 3000);

      if (data.status === "success") {
        fetchFeeHeads(); // refresh table
        bootstrap.Modal.getInstance(document.getElementById("editFeeHeadModal")).hide();

        // Wait a bit until table is refreshed, then highlight updated row
        setTimeout(() => {
          let row = document.querySelector(`#feeHeadTable tr[data-id='${id}']`);
          if (row) {
            row.classList.add("highlight-row");
            setTimeout(() => row.classList.remove("highlight-row"), 2000);
          }
        }, 300);

      }
    })
    .catch(err => console.error(err));
});

function deleteFeeHead(id) {
  if (!confirm("Are you sure you want to delete this Fee Head?")) return;

  fetch("../php/delete_fee_head.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "fee_head_id=" + encodeURIComponent(id)
  })
    .then(res => res.json())
    .then(data => {
      let msgDiv = document.getElementById("resultMsg");
      msgDiv.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
      setTimeout(() => { msgDiv.innerHTML = ""; }, 3000);

      if (data.status === "success") {
        // Remove row instantly
        let row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          row.classList.add("delete-row");
          setTimeout(() => {
            row.remove();
          }, 800); // wait for flash effect before removing
      }
      }
    })
    .catch(err => console.error(err));
}
