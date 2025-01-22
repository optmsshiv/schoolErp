<?php
// Set the response type to JSON
header('Content-Type: application/json');

// Include database connection
require_once '../db_connection.php'; // Ensure this path is correct

// Initialize the default response
$response = array("status" => "error", "message" => "Something went wrong!");

try {
    // Check if the request is POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Retrieve and sanitize form data
        $driver_aadhar = filter_input(INPUT_POST, 'driver_aadhar', FILTER_SANITIZE_STRING);
        $driver_name = filter_input(INPUT_POST, 'driver_name', FILTER_SANITIZE_STRING);
        $driver_mobile = filter_input(INPUT_POST, 'driver_mobile', FILTER_SANITIZE_STRING);
        $vehicle_name = filter_input(INPUT_POST, 'vehicle_name', FILTER_SANITIZE_STRING);
        $vehicle_number = filter_input(INPUT_POST, 'vehicle_number', FILTER_SANITIZE_STRING);
        $driver_address = filter_input(INPUT_POST, 'driver_address', FILTER_SANITIZE_STRING);
        $driver_status = filter_input(INPUT_POST, 'driver_status', FILTER_SANITIZE_STRING);

        // Validate inputs
        if (empty($driver_aadhar) || !preg_match('/^\d{12,16}$/', $driver_aadhar)) {
            throw new Exception("Invalid Aadhar number. It must be 12 to 16 digits long.");
        }

        if (empty($driver_name)) {
            throw new Exception("Driver name is required.");
        }

        if (empty($driver_mobile) || !preg_match('/^\d{10}$/', $driver_mobile)) {
            throw new Exception("Invalid mobile number. It must be exactly 10 digits.");
        }

        if (empty($vehicle_name)) {
            throw new Exception("Vehicle name is required.");
        }

        if (empty($vehicle_number)) {
            throw new Exception("Vehicle number is required.");
        }

        if (empty($driver_address)) {
            throw new Exception("Driver address is required.");
        }

        if (!in_array($driver_status, ['active', 'inactive'])) {
            throw new Exception("Invalid driver status. Allowed values are 'active' or 'inactive'.");
        }

        // Prepare SQL query
        $sql = "INSERT INTO school_driver (
                    driver_aadhar, driver_name, driver_mobile,
                    vehicle_name, vehicle_number, driver_address, driver_status
                ) VALUES (
                    :driver_aadhar, :driver_name, :driver_mobile,
                    :vehicle_name, :vehicle_number, :driver_address, :driver_status
                )";

        // Prepare and bind parameters
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':driver_aadhar', $driver_aadhar, PDO::PARAM_STR);
        $stmt->bindParam(':driver_name', $driver_name, PDO::PARAM_STR);
        $stmt->bindParam(':driver_mobile', $driver_mobile, PDO::PARAM_STR);
        $stmt->bindParam(':vehicle_name', $vehicle_name, PDO::PARAM_STR);
        $stmt->bindParam(':vehicle_number', $vehicle_number, PDO::PARAM_STR);
        $stmt->bindParam(':driver_address', $driver_address, PDO::PARAM_STR);
        $stmt->bindParam(':driver_status', $driver_status, PDO::PARAM_STR);

        // Execute the query
        if ($stmt->execute()) {
            $response = [
                "status" => "success",
                "message" => "Driver details saved successfully."
            ];
        } else {
            throw new Exception("Failed to execute the query.");
        }
    } else {
        $response["message"] = "Invalid request method.";
    }
} catch (PDOException $e) {
    // Log PDO errors to a file for debugging
    error_log("Database error: " . $e->getMessage(), 3, "../logs/error.log");
    $response["message"] = "A database error occurred. Please try again later.";
} catch (Exception $e) {
    // Handle general exceptions
    $response["message"] = $e->getMessage();
}

// Return the JSON response
echo json_encode($response);
?>
