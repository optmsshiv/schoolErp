<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

$feePlanId = $_POST['feePlanId'] ?? null;

if (!$feePlanId) {
    echo json_encode(['status' => 'error', 'message' => 'Fee plan ID is required.']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM feePlans WHERE id = ?");
    $stmt->bind_param('i', $feePlanId);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Fee plan deleted successfully.']);
    } else {
        throw new Exception('Error deleting fee plan.');
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
