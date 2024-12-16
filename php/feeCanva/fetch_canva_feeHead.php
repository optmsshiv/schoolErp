<?php
// Include the database connection configuration
require_once '../db_connection.php'; // Ensure this path points to your database connection script

try {
    // Fetch Feeheads data (id and fee_head_name)
    $stmt = $pdo->query("SELECT fee_head_id, fee_head_name FROM FeeHeads");

    // Fetch all rows as an associative array
    $feeheads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return structured JSON response
    if ($feeheads) {
        echo json_encode(['status' => 'success', 'data' => $feeheads]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No fee heads found.']);
    }
} catch (PDOException $e) {
    // Log the error and respond with a generic error message
    error_log('Error fetching Feeheads: ' . $e->getMessage(), 0);
    echo json_encode([
        'status' => 'error',
        'message' => 'An unexpected error occurred. Please try again later.'
    ]);
    exit;
}
?>
