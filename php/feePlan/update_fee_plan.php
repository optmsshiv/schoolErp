<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Collect input data from POST
$feePlanId = $_POST['id'] ?? null;
$className = $_POST['class_name'] ?? null;
$feeHeadName = $_POST['fee_head_name'] ?? null;
$monthName = $_POST['month_name'] ?? null;
$amount = $_POST['amount'] ?? null;

// Validate inputs
if (!$feePlanId || !$className || !$feeHeadName || !$monthName || !$amount) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required: id, class_name, fee_head_name, month_name, and amount.',
    ]);
    exit;
}

try {
    // Update the fee plan
    $sql = "UPDATE FeePlans
            SET class_name = :className, fee_head_name = :feeHeadName, month_name = :monthName, amount = :amount
            WHERE fee_plan_id = :feePlanId";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':feePlanId', $feePlanId, PDO::PARAM_INT);
    $stmt->bindParam(':className', $className, PDO::PARAM_STR);
    $stmt->bindParam(':feeHeadName', $feeHeadName, PDO::PARAM_STR);
    $stmt->bindParam(':monthName', $monthName, PDO::PARAM_STR);
    $stmt->bindParam(':amount', $amount, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Fee plan updated successfully.']);
    } else {
        throw new Exception('Failed to update the fee plan. Please try again.');
    }
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while updating the fee plan. Please try again later.',
    ]);
}
?>
