document.addEventListener("DOMContentLoaded", function () {
  const feeHeadSelect = document.getElementById("feeHeadSelect");
  const classSelect = document.getElementById("classNameSelect");

  function loadFeeData() {
    fetch("../php/create_fee_plan.php")
      .then(res => res.json())
      .then(data => {
        // Populate Fee Heads
        feeHeadSelect.innerHTML = '<option value="">Select Fee Head</option>';
        data.feeheads.forEach(fh => {
          let option = document.createElement("option");
          option.value = fh.id;  // you can use fh.fee_head_name if you don’t need id
          option.textContent = fh.fee_head_name;
          feeHeadSelect.appendChild(option);
        });

        // Populate Classes
        classSelect.innerHTML = '<option value="">Select Class</option>';
        data.classes.forEach(c => {
          let option = document.createElement("option");
          option.value = c.id;  // or c.class_name if needed
          option.textContent = c.class_name;
          classSelect.appendChild(option);
        });
      });
  }

  loadFeeData(); // load when page starts
});
