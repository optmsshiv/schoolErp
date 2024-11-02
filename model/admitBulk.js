document.getElementById('processButton').addEventListener('click', function() {
  const fileInput = document.getElementById('inputGroupFile01');
  const file = fileInput.files[0];

  if (file && file.type === 'text/csv') {
      const reader = new FileReader();

      reader.onload = function(e) {
          const text = e.target.result;
          const rows = text.split('\n');
          const tableBody = document.querySelector('#dataTable tbody');

          // Clear existing rows in the table
          tableBody.innerHTML = '';

          rows.forEach((row, index) => {
              if (row.trim() !== '') {
                  const columns = row.split(',');

                  // Create a new row and fill with data
                  const newRow = document.createElement('tr');
                  columns.forEach(column => {
                      const newCell = document.createElement('td');
                      newCell.textContent = column;
                      newRow.appendChild(newCell);
                  });

                  tableBody.appendChild(newRow);
              }
          });
      };

      reader.readAsText(file);
  } else {
      alert('Please upload a valid CSV file.');
  }
});
