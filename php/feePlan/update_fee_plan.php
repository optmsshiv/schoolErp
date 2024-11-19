<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Define an array of months (you can replace this with a database query if you have a months table)
    $months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Return success response with the list of months
    echo json_encode(['status' => 'success', 'data' => $months]);
} catch (PDOException $e) {
    // Log the error (for debugging purposes)
    error_log('Database error: ' . $e->getMessage());

    // Return error response
    echo json_encode(['status' => 'error', 'message' => 'Database error. Please try again later.']);
}
?>
