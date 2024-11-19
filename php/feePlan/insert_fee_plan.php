<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Ensure all necessary fields are available
$feeHeadName = $_POST['feeHead'] ?? null;
$className = $_POST['className'] ?? null;
$month = $_POST['month'] ?? null; // Month is expected to be a comma-separated string
$amount = $_POST['amount'] ?? null;

if (!$feeHeadName || !$className || !$month || !$amount) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

try {
    // Prepare the SQL query using PDO
    $sql = "INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount) VALUES (:fee_head_name, :class_name, :month_name, :amount)";
    $stmt = $conn->prepare($sql);

    // Bind parameters to the query
    $stmt->bindParam(':fee_head_name', $feeHeadName, PDO::PARAM_STR);
    $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);
    $stmt->bindParam(':month_name', $month, PDO::PARAM_STR); // Month should be a comma-separated string
    $stmt->bindParam(':amount', $amount, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Fee plan added successfully.']);
    } else {
        throw new Exception('Error inserting fee plan.');
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
