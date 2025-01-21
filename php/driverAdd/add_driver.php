<?php
// Include database connection
include '../db_connection.php'; // Ensure this file establishes the $pdo connection

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Capture form data
        $driverAadhar = $_POST['driver_aadhar'];
        $driverName = $_POST['driver_name'];
        $driverMobile = $_POST['driver_mobile'];
        $vehicleName = $_POST['vehicle_name'];
        $vehicleNumber = $_POST['vehicle_number'];
        $driverAddress = $_POST['driver_address'];
        $driverStatus = $_POST['driver_status'];

        // Prepare the SQL query
        $sql = "INSERT INTO school_driver (driver_aadhar, driver_name, driver_mobile, vehicle_name, vehicle_number, driver_address, driver_status)
                VALUES (:driver_aadhar, :driver_name, :driver_mobile, :vehicle_name, :vehicle_number, :driver_address, :driver_status)";

        // Prepare statement
        $stmt = $pdo->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':driver_aadhar', $driverAadhar, PDO::PARAM_STR);
        $stmt->bindParam(':driver_name', $driverName, PDO::PARAM_STR);
        $stmt->bindParam(':driver_mobile', $driverMobile, PDO::PARAM_STR);
        $stmt->bindParam(':vehicle_name', $vehicleName, PDO::PARAM_STR);
        $stmt->bindParam(':vehicle_number', $vehicleNumber, PDO::PARAM_STR);
        $stmt->bindParam(':driver_address', $driverAddress, PDO::PARAM_STR);
        $stmt->bindParam(':driver_status', $driverStatus, PDO::PARAM_STR);

        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Driver details added successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to add driver details."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
