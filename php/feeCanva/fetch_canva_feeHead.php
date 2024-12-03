<?php
// Include the database connection configuration
require_once '../db_connection.php'; // Ensure this path points to your database connection script

try {
    // Fetch Feeheads data
    $stmt = $pdo->query("SELECT fee_head_name FROM Feeheads");

    // Fetch all rows as an associative array
    $feeheads = $stmt->fetchAll();

    // Return data as a JSON response
    echo json_encode($feeheads);
} catch (PDOException $e) {
    // Log the error and respond with a generic error message
    error_log('Error fetching Feeheads: ' . $e->getMessage(), 0);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch fee heads. Please try again later.'
    ]);
    exit;
}
?>
