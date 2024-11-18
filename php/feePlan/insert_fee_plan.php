<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Get POST data from AJAX request
$feeHead = $_POST['feeHead'] ?? null;
$className = $_POST['className'] ?? null;
$months = $_POST['months'] ?? [];
$amount = $_POST['amount'] ?? null;

// Validate input
if (!$feeHead || !$className || empty($months) || !$amount) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

// Insert the fee plan for each selected month
try {
    // Start a transaction to ensure data integrity
    $conn->begin_transaction();

    foreach ($months as $month) {
        $stmt = $conn->prepare("INSERT INTO FeePlans (class_name, fee_head_name, month, amount) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('ssss', $className, $feeHead, $month, $amount);

        if (!$stmt->execute()) {
            throw new Exception('Error inserting fee plan.');
        }
    }

    // Commit the transaction if all inserts are successful
    $conn->commit();

    echo json_encode(['status' => 'success', 'message' => 'Fee plan(s) added successfully.']);
} catch (Exception $e) {
    // Rollback the transaction if any insert fails
    $conn->rollback();

    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    // Close the prepared statement and the database connection
    $stmt->close();
    $conn->close();
}
?>
