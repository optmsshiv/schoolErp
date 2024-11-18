<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Fetch all classes from the database
    $sql = "SELECT fee_head_name, class_name, month_name, amount FROM FeePlans ORDER BY class_name";
    $stmt = $pdo->query($sql);

    // Check if any classes were found
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($classes) {
        // Return success response with classes data
        echo json_encode(['status' => 'success', 'data' => $classes]);
    } else {
        // Return success response but no data found
        echo json_encode(['status' => 'success', 'data' => [], 'message' => 'No classes found']);
    }
} catch (PDOException $e) {
    // Log the error (instead of displaying it) for security reasons
    error_log('Database error: ' . $e->getMessage());

    // Return error response
    echo json_encode(['status' => 'error', 'message' => 'Database error. Please try again later.']);
}
?>
