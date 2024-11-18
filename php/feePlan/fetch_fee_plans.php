<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include database connection
require_once '../db_connection.php';

// Test the database connection
if (!$conn) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed'
    ]);
    exit;
}

// Initialize response array
$response = [
    'status' => 'error',
    'message' => 'No data found',
    'data' => []
];

// Query to fetch fee plans
$query = "SELECT fee_head_name, class_name, month_name, amount FROM FeePlans ORDER BY class_name ASC";

// Execute the query
try {
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
}

// Close the database connection
$conn = null;

// Return JSON response
echo json_encode($response);
?>
