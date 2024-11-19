<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Validate and fetch POST data

$className = $_POST['class_name'] ?? null;
$feeHeadName = $_POST['fee_head_name'] ?? null;
$monthName = $_POST['month_name'] ?? null;
$amount = $_POST['amount'] ?? null;

// Check if all required fields are provided
if (!$feeHeadName || !$className || !$monthName || !$amount) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required.'
    ]);
    exit;
}

try {
    // Prepare the SQL query to update the fee plan
    $sql = "UPDATE FeePlans
            SET fee_head_name = :feeHeadName,
                class_name = :className,
                month_name = :monthName,
                amount = :amount,
                updated_at = NOW()
            WHERE fee_plan_id = :feePlanId";

    $stmt = $pdo->prepare($sql);

    // Bind parameters to prevent SQL injection
    
    $stmt->bindParam(':feeHeadName', $feeHeadName, PDO::PARAM_STR);
    $stmt->bindParam(':className', $className, PDO::PARAM_STR);
    $stmt->bindParam(':monthName', $monthName, PDO::PARAM_STR);
    $stmt->bindParam(':amount', $amount, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Fee plan updated successfully.'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update the fee plan.'
        ]);
    }
} catch (Exception $e) {
    // Log the error for debugging
    error_log('Error: ' . $e->getMessage());

    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while updating the fee plan.'
    ]);
}
?>
