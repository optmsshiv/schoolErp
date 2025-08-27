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
      }
    })
    .catch(err => console.error(err));
});
