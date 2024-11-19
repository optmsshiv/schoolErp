<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Ensure all necessary fields are available
$feeHeadName = $_POST['fee_head_name'] ?? null;
$className = $_POST['class_name'] ?? null;
$month = $_POST['month'] ?? null;
$amount = $_POST['amount'] ?? null;

if (!$feeHeadName || !$className || !$month || !$amount) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

try {
    // Insert fee plan into the database
    $sql = "INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssi', $feeHeadName, $className, $month, $amount); // s for string, i for integer

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Fee plan added successfully.']);
    } else {
        throw new Exception('Error inserting fee plan.');
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
