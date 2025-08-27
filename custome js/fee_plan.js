document.addEventListener("DOMContentLoaded", function () {
  const feeHeadForm = document.getElementById("feeHeadForm");
  const feeHeadList = document.getElementById("feeHeadList");

  // Handle form submit
  feeHeadForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const feeHeadName = document.getElementById("feeHeadName").value;

    fetch("../php/insert_fee_head.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "fee_head_name=" + encodeURIComponent(feeHeadName)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        if (data.success) {
          document.getElementById("feeHeadName").value = "";
          loadFeeData(); // reload list
        }
      });
  });

  // Fetch Fee Heads + Classes
  function loadFeeData() {
    fetch("../php/fetch_fee_head.php")
      .then(res => res.json())
      .then(data => {
        // Fee Heads
        feeHeadList.innerHTML = "";
        data.feeHeads.forEach(fh => {
          let li = document.createElement("li");
          li.className = "list-group-item";
          li.textContent = fh.fee_head_name;
          feeHeadList.appendChild(li);
        });

        // Classes dropdown (if you have one)
        const classSelect = document.getElementById("classNameSelect");
        if (classSelect) {
          classSelect.innerHTML = "";
          data.classes.forEach(c => {
            let option = document.createElement("option");
            option.value = c.id;
            option.textContent = c.class_name;
            classSelect.appendChild(option);
          });
        }
      });
  }

  loadFeeData(); // initial load
});

