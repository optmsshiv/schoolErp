<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

$feePlanId = $_POST['feePlanId'] ?? null;
$className = $_POST['className'] ?? null;
$feeHeadName = $_POST['feeHeadName'] ?? null;
$month = $_POST['month'] ?? null;
$amount = $_POST['amount'] ?? null;

if (!$feePlanId || !$className || !$feeHeadName || !$month || !$amount) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE feePlans SET class_name = ?, fee_head_name = ?, month = ?, amount = ? WHERE id = ?");
    $stmt->bind_param('sssdi', $className, $feeHeadName, $month, $amount, $feePlanId);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Fee plan updated successfully.']);
    } else {
        throw new Exception('Error updating fee plan.');
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
