<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Get POST data
$className = $_POST['className'] ?? null;
$feeHeadName = $_POST['feeHeadName'] ?? null;
$month = $_POST['month'] ?? null;
$amount = $_POST['amount'] ?? null;

// Validate input
if (!$className || !$feeHeadName || !$month || !$amount) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

try {
    // Prepare SQL statement for inserting the fee plan
    $stmt = $conn->prepare("INSERT INTO feePlans (class_name, fee_head_name, month, amount) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('sssd', $className, $feeHeadName, $month, $amount);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Fee plan added successfully.']);
    } else {
        throw new Exception('Error inserting fee plan.');
    }

    // Close the statement
    $stmt->close();
} catch (Exception $e) {
    // Return error message if exception occurs
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

// Close the database connection
$conn->close();
?>
