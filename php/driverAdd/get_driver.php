<?php
// Include your database connection
require_once '../db_connection.php';

header('Content-Type: application/json');

try {
    // Query to fetch driver details
    $sql = "SELECT
                driver_aadhar, driver_name, driver_mobile,
                vehicle_name, vehicle_number, driver_address, driver_status
            FROM school_driver";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch all records
    $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return data as JSON
    echo json_encode(['status' => 'success', 'data' => $drivers]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
