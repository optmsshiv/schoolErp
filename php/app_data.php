<?php
// Include the database connection
require_once '/php/db_connection.php'; // Path to your db_connection.php file

try {
    // Query to fetch data
    $sql = "SELECT id, name, email FROM users"; // Replace with your table and fields
    $stmt = $pdo->query($sql);

    // Fetch data
    $data = $stmt->fetchAll();
    if (!empty($data)) {
        // Return JSON response
        echo json_encode($data);
    } else {
        echo json_encode(["message" => "No records found"]);
    }
} catch (PDOException $e) {
    // Log query error
    error_log('Database query failed: ' . $e->getMessage(), 0);

    // Respond with a generic error
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to fetch data. Please try again later.'
    ]);
}
?>
