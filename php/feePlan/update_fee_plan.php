<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Collect input data from POST
$feePlanId = $_POST['feePlanId'] ?? null;
$className = $_POST['className'] ?? null;
$feeHeadName = $_POST['feeHeadName'] ?? null;
$monthName = $_POST['monthName'] ?? null;
$amount = $_POST['amount'] ?? null;

// Validate inputs
if (!$feePlanId || !$className || !$feeHeadName || !$monthName || !$amount) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required: feePlanId, className, feeHeadName, monthName, and amount.',
    ]);
    exit;
}

try {
    // Update the fee plan
    $sql = "UPDATE FeePlans
            SET class_name = :className, fee_head_name = :feeHeadName, month_name = :monthName, amount = :amount
            WHERE fee_plan_id = :feePlanId";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':className', $className, PDO::PARAM_STR);
    $stmt->bindParam(':feeHeadName', $feeHeadName, PDO::PARAM_STR);
    $stmt->bindParam(':monthName', $monthName, PDO::PARAM_STR);
    $stmt->bindParam(':amount', $amount, PDO::PARAM_INT);
    $stmt->bindParam(':feePlanId', $feePlanId, PDO::PARAM_INT);

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
