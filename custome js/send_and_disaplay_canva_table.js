document.addEventListener("DOMContentLoaded", () => {
  const feeCollectionTable = document.querySelector("#FeeCollection tbody");
  const payableAmount = document.getElementById("payableAmount");
  const receivedFee = document.getElementById("recievedFee");
  const dueAmount = document.getElementById("dueAmount");
  const advancedFee = document.getElementById("advancedFee");

  const saveFeeButton = document.getElementById("saveFeeButton");
  const feeTypeDropdown = document.getElementById("feeType");
  const feeAmountInput = document.getElementById("feeAmount");
  const feeMonthDropdown = document.getElementById("feeMonth");

  // Fetch Feeheads from server
  fetch("../php/feeCanva/fetch_canva_feeHead.php")
    .then((response) => response.json())
    .then((data) => {
      feeTypeDropdown.innerHTML =
        '<option value="" disabled selected>Select Fee Type</option>';
      data.forEach((feehead) => {
        const option = document.createElement("option");
        option.value = feehead.id;
        option.textContent = feehead.fee_head_name;
        feeTypeDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching fee types:", error);
      feeTypeDropdown.innerHTML =
        '<option value="" disabled selected>Error loading fee types</option>';
    });

  // Update total calculation
  const updateTotals = () => {
    let total = 0;
    let received = 0;
    let advanced = 0;

    // Loop through table rows to calculate totals
    Array.from(feeCollectionTable.children).forEach((row) => {
      const amount = parseFloat(row.querySelector(".fee-amount").textContent);
      total += amount;
    });

    // Update input fields
    payableAmount.value = total;
    receivedFee.value = received;
    dueAmount.value = total - received;
    advancedFee.value = advanced;
  };

  // Add Fee to FeeCollection table
  saveFeeButton.addEventListener("click", (e) => {
    e.preventDefault();

    const feeType = feeTypeDropdown.options[feeTypeDropdown.selectedIndex].text;
    const feeAmount = parseFloat(feeAmountInput.value);
    const feeMonth = feeMonthDropdown.value;

    if (!feeType || isNaN(feeAmount) || !feeMonth) {
      alert("Please fill in all required fields.");
      return;
    }

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>${feeMonth}</td>
      <td>${feeType}</td>
      <td class="fee-amount">${feeAmount.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn">Delete</button>
      </td>
    `;

    feeCollectionTable.appendChild(newRow);

    // Clear form fields
    feeTypeDropdown.selectedIndex = 0;
    feeAmountInput.value = "";
    feeMonthDropdown.selectedIndex = 0;

    updateTotals();
  });

  // Handle table actions (Edit/Delete)
  feeCollectionTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      // Confirmation for delete action
      if (confirm("Are you sure you want to delete this entry?")) {
        e.target.closest("tr").remove();
        updateTotals();
      }
    }

    if (e.target.classList.contains("edit-btn")) {
      const row = e.target.closest("tr");
      const feeMonth = row.children[0].textContent;
      const feeType = row.children[1].textContent;
      const feeAmount = parseFloat(row.children[2].textContent);

      // Populate form fields for editing
      feeMonthDropdown.value = feeMonth;
      feeTypeDropdown.value = feeTypeDropdown.querySelector(
        `option:contains(${feeType})`
      ).value;
      feeAmountInput.value = feeAmount;

      // Remove row on edit
      row.remove();
      updateTotals();
    }
  });
});
