document.getElementById('submitButton').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent form submission

  // Show loading overlay (if implemented)
  document.getElementById('loadingOverlay').style.display = 'flex';

  const formData = new FormData(document.getElementById('studentBulkData'));

  fetch('../php/admit_bulk_submit.php', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    // Check if the response is OK and has content
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text(); // Use text() first to inspect the response before JSON parsing
  })
  .then(text => {
    try {
      const data = JSON.parse(text); // Parse JSON if response is valid
      document.getElementById('loadingOverlay').style.display = 'none'; // Hide loading overlay

      if (data.success) {
        alert(data.message);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (e) {
      // Handle JSON parse errors
      console.error('Could not parse JSON:', text);
      alert('An error occurred: Response could not be processed.');
    }
  })
  .catch(error => {
    document.getElementById('loadingOverlay').style.display = 'none'; // Hide loading overlay
    console.error('Fetch error:', error);
    alert('An error occurred while submitting the data.');
  });
});
