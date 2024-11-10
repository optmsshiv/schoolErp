  document.addEventListener('DOMContentLoaded', function () {
    // Get the update button and form fields
    const saveButton = document.querySelector('.btn-success');
    const currentAddress = document.getElementById('updateCurrentAddress');
    const permanentAddress = document.getElementById('updatePermanentAddress');
    const city = document.getElementById('updateCity');
    const state = document.getElementById('updateState');
    const pincode = document.getElementById('updatePincode');
    const landmark = document.getElementById('updateLandmark');
    const country = document.getElementById('updateCountry');
    const latitude = document.getElementById('updateLatitude');
    const longitude = document.getElementById('updateLongitude');

    // Function to handle saving the updates
    saveButton.addEventListener('click', function () {
      const updatedAddress = {
        currentAddress: currentAddress.value,
        permanentAddress: permanentAddress.value,
        city: city.value,
        state: state.value,
        pincode: pincode.value,
        landmark: landmark.value,
        country: country.value,
        latitude: latitude.value,
        longitude: longitude.value
      };

      // Validate the form fields (optional)
      if (validateFields(updatedAddress)) {
        // You can use AJAX to send the updated address data to the server
        console.log("Updated Address:", updatedAddress);

        // Simulating a save with localStorage (or you can save to server via AJAX)
        localStorage.setItem('schoolAddress', JSON.stringify(updatedAddress));

        // Optionally close the off-canvas after saving
        const offCanvas = new bootstrap.Offcanvas(document.getElementById('updateCanvas'));
        offCanvas.hide();

        // Provide feedback to the user (optional)
        alert('Address updated successfully!');
      } else {
        alert('Please fill all the fields correctly.');
      }
    });

    // Simple validation function (you can extend it as needed)
    function validateFields(address) {
      return Object.values(address).every(value => value.trim() !== '');
    }
  });

