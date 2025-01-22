document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('addDriverDetails').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/php/driverAdd/add_driver.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        this.reset(); // Reset form
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  });
});

