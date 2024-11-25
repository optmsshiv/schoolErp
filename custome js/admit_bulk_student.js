document.getElementById('processButton').addEventListener('click', function () {
  const fileInput = document.getElementById('inputGroupFile01');
  const file = fileInput.files[0];
  if (file && file.type === 'text/csv') {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;

      // Parse CSV with fields that might contain commas or quotes
      const rows = text.split('\n').map(row => {
        const match = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        return match ? match.map(cell => cell.replace(/^"|"$/g, '')) : [];
      });

      const tableBody = document.querySelector('#dataTable tbody');
      tableBody.innerHTML = ''; // Clear existing rows

      rows.slice(1).forEach((row, index) => { // Skip the header row
        if (row.length > 0 && row.join('').trim() !== '') { // Check if the row is not empty
          const tr = document.createElement('tr');

          // Add S.No cell
          const sNoCell = document.createElement('td');
          sNoCell.textContent = index + 1; // Auto-generate S.No
          tr.appendChild(sNoCell);

          row.forEach((col, colIndex) => {
            const td = document.createElement('td');
            td.textContent = col.trim();

            // Customize cell classes or behavior for specific fields if needed
            if (colIndex === 12) { // Assuming "Father Name" is the 13th column (index 12)
              td.classList.add('nowrap');
            }

            // Example: Highlighting income fields (just for demonstration)
            if (colIndex === 22 || colIndex === 27) { // Assuming "father_income" and "mother_income" columns
              td.classList.add('highlight-income');
            }

            tr.appendChild(td);
          });

          tableBody.appendChild(tr);
        }
      });
    };
    reader.readAsText(file);
  } else {
    alert('Please upload a valid CSV file.');
  }
});

document.getElementById('resetButton').addEventListener('click', function () {
  const tableBody = document.querySelector('#dataTable tbody');
  tableBody.innerHTML = ''; // Clear the table data
});
