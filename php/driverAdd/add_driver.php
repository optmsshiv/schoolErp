<?php
// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
// Include your database connection
require_once '../db_connection.php'; // Replace with your actual connection file

$response = array("status" => "error", "message" => "Something went wrong!");

try {
    // Check if the request is a POST request
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Retrieve form data
        $driver_aadhar = $_POST['driver_aadhar'];
        $driver_name = $_POST['driver_name'];
        $driver_mobile = $_POST['driver_mobile'];
        $vehicle_name = $_POST['vehicle_name'];
        $vehicle_number = $_POST['vehicle_number'];
        $driver_address = $_POST['driver_address'];
        $driver_status = $_POST['driver_status'];

        // Validate inputs
        if (
            empty($driver_aadhar) || !preg_match('/^\d{12,16}$/', $driver_aadhar) ||
            empty($driver_name) ||
            empty($driver_mobile) || !preg_match('/^\d{10}$/', $driver_mobile) ||
            empty($vehicle_name) ||
            empty($vehicle_number) ||
            empty($driver_address) ||
            !in_array($driver_status, ['active', 'inactive'])
        ) {
            throw new Exception("Invalid input data.");
        }

        // Prepare SQL statement using PDO
        $sql = "INSERT INTO school_driver (
                    driver_aadhar, driver_name, driver_mobile,
                    vehicle_name, vehicle_number, driver_address, driver_status
                ) VALUES (
                    :driver_aadhar, :driver_name, :driver_mobile,
                    :vehicle_name, :vehicle_number, :driver_address, :driver_status
                )";

        // Prepare the statement
        $stmt = $pdo->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':driver_aadhar', $driver_aadhar, PDO::PARAM_STR);
        $stmt->bindParam(':driver_name', $driver_name, PDO::PARAM_STR);
        $stmt->bindParam(':driver_mobile', $driver_mobile, PDO::PARAM_STR);
        $stmt->bindParam(':vehicle_name', $vehicle_name, PDO::PARAM_STR);
        $stmt->bindParam(':vehicle_number', $vehicle_number, PDO::PARAM_STR);
        $stmt->bindParam(':driver_address', $driver_address, PDO::PARAM_STR);
        $stmt->bindParam(':driver_status', $driver_status, PDO::PARAM_STR);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Driver details saved successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to save driver details.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>


