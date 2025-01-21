<?php
// Include your database connection
require_once '../db_connection.php'; // Replace with your actual connection file

$response = array("status" => "error", "message" => "Something went wrong!");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        // Get JSON input data
        $input = json_decode(file_get_contents("php://input"), true);

        // Extract data from the request
        $driver_aadhar = $input['driver_aadhar'] ?? null;
        $driver_name = $input['driver_name'] ?? null;
        $driver_mobile = $input['driver_mobile'] ?? null;
        $vehicle_name = $input['vehicle_name'] ?? null;
        $vehicle_number = $input['vehicle_number'] ?? null;
        $driver_address = $input['driver_address'] ?? null;
        $driver_status = $input['driver_status'] ?? 'active';

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

        $stmt = $pdo->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':driver_aadhar', $driver_aadhar);
        $stmt->bindParam(':driver_name', $driver_name);
        $stmt->bindParam(':driver_mobile', $driver_mobile);
        $stmt->bindParam(':vehicle_name', $vehicle_name);
        $stmt->bindParam(':vehicle_number', $vehicle_number);
        $stmt->bindParam(':driver_address', $driver_address);
        $stmt->bindParam(':driver_status', $driver_status);

        // Execute statement
        if ($stmt->execute()) {
            $response = array("status" => "success", "message" => "Driver details saved successfully!");
        } else {
            throw new Exception("Failed to save driver details.");
        }
    } catch (Exception $e) {
        $response = array("status" => "error", "message" => $e->getMessage());
    }
}

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
