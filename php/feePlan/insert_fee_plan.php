<?php
include '../db_connection.php';

header('Content-Type: application/json');

// Get POST data from the request
$feeHead = $_POST['feeHead'] ?? null;
$className = $_POST['className'] ?? null;
$month = $_POST['month'] ?? null;  // Expecting a single month
$amount = $_POST['amount'] ?? null;

if (!$feeHead || !$className || !$month || !$amount) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required.'
    ]);
    exit;
}

// Insert the fee plan into the database
$sql = "INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount)
        VALUES (:fee_head_name, :class_name, :month_name, :amount)";
$params = [
    ':fee_head_name' => $feeHead,
    ':class_name' => $className,
    ':month_name' => $month,
    ':amount' => $amount
];

try {
    // Prepare and execute the SQL statement
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        'status' => 'success',
        'message' => 'Fee plan added successfully.'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} finally {
    // Close the database connection
    $conn = null;
}
?>
