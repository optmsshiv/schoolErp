 // Fetch Feeheads from the server
 fetch('../php/feeCanvas/fetch_canva_feeHead.php')
 .then(response => response.json())
 .then(data => {
   const feeTypeDropdown = document.getElementById('feeType');
   feeTypeDropdown.innerHTML = '<option value="" disabled selected>Select Fee Type</option>'; // Clear default option

   // Populate options dynamically
   data.forEach(feehead => {
     const option = document.createElement('option');
     option.value = feehead.id;
     option.textContent = feehead.fee_head_name;
     feeTypeDropdown.appendChild(option);
   });
 })
 .catch(error => {
   console.error('Error fetching fee types:', error);
   const feeTypeDropdown = document.getElementById('feeType');
   feeTypeDropdown.innerHTML = '<option value="" disabled selected>Error loading fee types</option>';
 });
