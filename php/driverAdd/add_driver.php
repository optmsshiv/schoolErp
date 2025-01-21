<?php
// Include database connection
include '../db_connection.php';

// Function to save driver details
function saveDriverDetails($driverAadhar, $driverName, $driverMobile, $vehicleName, $vehicleNumber, $driverAddress) {
    global $conn;

    try {
        // Prepare SQL query
        $sql = "INSERT INTO school_driver
                (driver_aadhar, driver_name, driver_mobile, vehicle_name, vehicle_number, driver_address)
                VALUES (?, ?, ?, ?, ?, ?)";

        // Prepare statement
        $stmt = $conn->prepare($sql);

        // Bind parameters
        $stmt->bind_param("ssssss", $driverAadhar, $driverName, $driverMobile, $vehicleName, $vehicleNumber, $driverAddress);

        // Execute the query
        if ($stmt->execute()) {
            echo "Driver details saved successfully.";
        } else {
            echo "Error: " . $stmt->error;
        }

        // Close the statement
        $stmt->close();
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

// Sample form data (you can replace these with POST data from an HTML form)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $driverAadhar = $_POST['driver_aadhar'];
    $driverName = $_POST['driver_name'];
    $driverMobile = $_POST['driver_mobile'];
    $vehicleName = $_POST['vehicle_name'];
    $vehicleNumber = $_POST['vehicle_number'];
    $driverAddress = $_POST['driver_address'];

    // Call the function to save driver details
    saveDriverDetails($driverAadhar, $driverName, $driverMobile, $vehicleName, $vehicleNumber, $driverAddress);
}

?>
