<?php
// Include the database connection configuration
require_once '../db_connection.php';

try {
    $stmt = $pdo->query("SELECT fee_head_id, fee_head_name FROM FeeHeads");
    $feeheads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $feeheads]);
} catch (PDOException $e) {
    error_log('Error fetching Feeheads: ' . $e->getMessage(), 0);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch fee heads. Please try again later.'
    ]);
    exit;
}
?>
