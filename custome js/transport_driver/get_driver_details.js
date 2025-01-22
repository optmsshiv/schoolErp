document.addEventListener("DOMContentLoaded", function () {
  // Fetch driver details on page load
  fetch('/php/driverAdd/get_driver.php') // Replace with the actual path
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const drivers = data.data;
        const driverTable = document.getElementById("driverTable");

        // Create a <tbody> dynamically
        let tbody = document.createElement("tbody");

        // Populate table rows
        drivers.forEach(driver => {
          let tr = document.createElement("tr");
          tr.style.textAlign = "center";

          tr.innerHTML = `
              <td>${driver.driver_aadhar}</td>
              <td>${driver.driver_name}</td>
              <td>${driver.driver_mobile}</td>
              <td>${driver.vehicle_name}</td>
              <td>${driver.vehicle_number}</td>
              <td>${driver.driver_address}</td>
              <td>$<span class="badge"
                      :class="{
                              'bg-success': driver.driver_status === 'active',
                                'bg-info': driver.driver_status === 'pending'
                                }">
                              {{ driver.driver_status }}
                        </span></td>
              <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editDriver(${driver.driver_id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteDriver(${driver.driver_id})">Delete</button>
              </td>
            `;

          tbody.appendChild(tr);
        });

        // Remove existing <tbody> and append new one
        const existingTbody = driverTable.parentNode.querySelector("tbody");
        if (existingTbody) {
          existingTbody.remove();
        }
        driverTable.parentNode.appendChild(tbody);
      } else {
        console.error(data.message);
        alert("Failed to fetch driver details.");
      }
    })
    .catch(error => {
      console.error("Error fetching driver details:", error);
      alert("An error occurred while fetching driver details.");
    });
});

// Functions for Edit and Delete (to be implemented)
function editDriver(driverId) {
  alert("Edit functionality for Driver ID: " + driverId);
  // Add your edit logic here
}

function deleteDriver(driverId) {
  if (confirm("Are you sure you want to delete Driver ID: " + driverId + "?")) {
    alert("Delete functionality for Driver ID: " + driverId);
    // Add your delete logic here
  }
}
