<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Fetch all fee plans from the database
    $sql = "SELECT fee_head_name, class_name, month_name, amount FROM FeePlans ORDER BY class_name";
    $stmt = $pdo->query($sql);

    // Check if any fee plans were found
    $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($feePlans) {
        // Return success response with fee plans data
        echo json_encode(['status' => 'success', 'data' => $feePlans]);
    } else {
        // Return success response but no fee plans found
        echo json_encode(['status' => 'success', 'data' => [], 'message' => 'No fee plans found']);
    }
} catch (PDOException $e) {
    // Log the error (instead of displaying it) for security reasons
    error_log('Database error: ' . $e->getMessage());

    // Return error response
    echo json_encode(['status' => 'error', 'message' => 'Database error. Please try again later.']);
}
?>
