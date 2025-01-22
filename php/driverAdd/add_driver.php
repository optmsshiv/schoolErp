<?php
header('Content-Type: application/json');
require_once '../db_connection.php';

$response = array("status" => "error", "message" => "Something went wrong!");

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $driver_aadhar = filter_input(INPUT_POST, 'driver_aadhar', FILTER_SANITIZE_STRING);
        $driver_name = filter_input(INPUT_POST, 'driver_name', FILTER_SANITIZE_STRING);
        $driver_mobile = filter_input(INPUT_POST, 'driver_mobile', FILTER_SANITIZE_STRING);
        $vehicle_name = filter_input(INPUT_POST, 'vehicle_name', FILTER_SANITIZE_STRING);
        $vehicle_number = filter_input(INPUT_POST, 'vehicle_number', FILTER_SANITIZE_STRING);
        $driver_address = filter_input(INPUT_POST, 'driver_address', FILTER_SANITIZE_STRING);
        $driver_status = filter_input(INPUT_POST, 'driver_status', FILTER_SANITIZE_STRING);

        if (empty($driver_aadhar) || !preg_match('/^\d{12,16}$/', $driver_aadhar)) {
            throw new Exception("Invalid Aadhar number.");
        }

        if (empty($driver_mobile) || !preg_match('/^\d{10}$/', $driver_mobile)) {
            throw new Exception("Invalid mobile number.");
        }

        $sql = "INSERT INTO school_driver (
                    driver_aadhar, driver_name, driver_mobile,
                    vehicle_name, vehicle_number, driver_address, driver_status
                ) VALUES (
                    :driver_aadhar, :driver_name, :driver_mobile,
                    :vehicle_name, :vehicle_number, :driver_address, :driver_status
                )";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':driver_aadhar', $driver_aadhar);
        $stmt->bindParam(':driver_name', $driver_name);
        $stmt->bindParam(':driver_mobile', $driver_mobile);
        $stmt->bindParam(':vehicle_name', $vehicle_name);
        $stmt->bindParam(':vehicle_number', $vehicle_number);
        $stmt->bindParam(':driver_address', $driver_address);
        $stmt->bindParam(':driver_status', $driver_status);

        if ($stmt->execute()) {
            $response = ["status" => "success", "message" => "Driver details saved successfully."];
        } else {
            throw new Exception("Failed to save driver details.");
        }
    } else {
        $response["message"] = "Invalid request method.";
    }
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage(), 3, "../logs/error.log");
    $response["message"] = "A database error occurred. Please try again later.";
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage(), 3, "../logs/error.log");
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
?>
