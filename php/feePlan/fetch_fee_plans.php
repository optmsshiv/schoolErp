<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include database connection
require_once '../db_connection.php';

// Initialize response array
$response = [
    'status' => 'error',
    'message' => 'No data found',
    'data' => []
];

try {
    // Test if the database connection is successful
    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $query = "SELECT fee_head_name, class_name, month_name, amount FROM FeePlans ORDER BY class_name ASC";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $feePlans = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $feePlans[] = $row;
        }
        $response['status'] = 'success';
        $response['message'] = 'Data fetched successfully';
        $response['data'] = $feePlans;
    } else {
        $response['message'] = 'No fee plans found';
    }
} catch (PDOException $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

// Close the connection
$conn = null;

// Set the content type to JSON
header('Content-Type: application/json');

// Return the response
echo json_encode($response);
?>
