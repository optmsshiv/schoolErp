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
              <td><span class="badge ${driver.driver_status === 'active' ? 'bg-label-success' : 'bg-label-danger'}">${driver.driver_status}</span></td>
              <td>
                <a href="javascript:;" onclick="viewDriver(${driver.driver_id})" class="tf-icons bx bx-show bx-sm me-2 text-info" data-bs-toggle="tooltip" data-bs-placement="top" title="View Driver Details"></a>
                <a href="javascript:;" class="tf-icons bx bx-trash bx-sm me-2 text-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Driver" onclick="deleteDriver(${driver.driver_id})"></a>
                <a href="javascript:;"
                          class="tf-icons bx bx-dots-vertical-rounded bx-sm me-2 text-warning"
                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                          data-bs-auto-close="outside"
                          data-bs-display="static"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                           title="More Options"
                           aria-controls="dropdownMenuButton1">
                           </a>
                           <ul class="dropdown-menu dropdown-menu-end"
                           id="dropdownMenuButton1"
                           aria-labelledby="dropdownMenuButton1">
                            <a class="dropdown-item" onclick="editDriver(${driver.driver_id})" href="javascript:;">Edit</a>
                            <a class="dropdown-item" onclick="suspendDriver(${driver.driver_id})" href="javascript:;">Suspended</a>
                           </ul>

              </td>
            `;

            tbody.appendChild(tr);
          });

          //<a class="btn btn-warning btn-sm me-1" onclick="editDriver(${driver.driver_id})"></a>
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

  function suspendDriver(driverId) {
    alert("Suspend functionality for Driver ID: " + driverId);
    // Add your suspend logic here
  }

  function viewDriver(driverId) {
    alert("View functionality for Driver ID: " + driverId);
    // Add your view logic here
  }
