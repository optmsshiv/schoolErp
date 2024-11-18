<?php
require '../db_connection.php'; // Ensure this includes the PDO connection setup

header('Content-Type: application/json');

try {
    // Retrieve POST data
    $feeHead = $_POST['feeHead'] ?? null;
    $className = $_POST['className'] ?? null;
    $month = $_POST['month'] ?? null;
    $feeAmount = $_POST['feeAmount'] ?? null;

    // Validate input
    if (!$feeHead || !$className || !$month || !$feeAmount) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }
    // Insert into database
    $sql = "INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount)
            VALUES (:fee_head_name, :class_name, :month_name, :amount)";
    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ':fee_head_name' => $feeHead,
        ':class_name' => $className,
        ':month_name' => $month,
        ':amount' => $feeAmount,
    ]);

    // Success response
    echo json_encode(['status' => 'success', 'message' => 'Fee plan added successfully.']);
} catch (PDOException $e) {
    // Error response
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    error_log('Error: ' . $e->getMessage()); // Log error for debugging
    exit;
}
