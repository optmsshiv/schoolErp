<?php
// Display all errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php'; // Make sure this file is included

// Prepare the query to fetch distinct class names
$sql = "SELECT DISTINCT class_name FROM Classes ORDER BY class_name ASC";

try {
    // Prepare and execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch all the class names
    $classes = $stmt->fetchAll();

    // Return the result as a JSON response
    echo json_encode(['classes' => array_column($classes, 'class_name')]);

} catch (PDOException $e) {
    // Handle query execution error
    error_log('Query execution failed: ' . $e->getMessage(), 0);

    // Return error response
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to fetch class names. Please try again later.'
    ]);
}

// Close the connection (optional with PDO, but good practice)
$pdo = null;
?>
