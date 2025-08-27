document.getElementById("feeHeadForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let feeHeadName = document.getElementById("feeHeadName").value;

  fetch("../php/insert_fee_head.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "feeHeadName=" + encodeURIComponent(feeHeadName)
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("resultMsg").innerHTML =
        `<div class="alert alert-${data.status}">${data.message}</div>`;
      if (data.status === "success") {
        document.getElementById("feeHeadForm").reset();
        fetchFeeHeads(); // Refresh list after adding
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
            <tr>
              <td>${index + 1}</td>
              <td>${row.fee_head_name}</td>
            </tr>`;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="2" class="text-center">No Fee Heads Found</td></tr>`;
      }
    })
    .catch(err => console.error(err));
}
