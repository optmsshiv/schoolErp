<?php
include '../db_connection.php'; // Include your PDO database connection script

header('Content-Type: application/json');

// Get POST data from the request
$feeHead = $_POST['feeHeadSelect'] ?? null;
$className = $_POST['classNameSelect'] ?? null;
$months = $_POST['months'] ?? null; // Expecting an array of months
$amount = $_POST['feeAmount'] ?? null;

// Validate input
if (!$feeHead || !$className || !$months || !$amount) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required.'
    ]);
    exit;
}

try {
    // Start a transaction
    $conn->beginTransaction();

    // Prepare the SQL query
    $sql = "INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount)
            VALUES (:fee_head_name, :class_name, :month_name, :amount)";
    $stmt = $conn->prepare($sql);

    // Loop through months and insert for each month
    foreach ($months as $month_name) {
        $stmt->execute([
            ':fee_head_name' => $feeHead,
            ':class_name' => $className,
            ':month_name' => $month_name,
            ':amount' => $amount
        ]);
    }

    // Commit the transaction
    $conn->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Fee plan added successfully.'
    ]);
} catch (PDOException $e) {
    // Rollback the transaction if any error occurs
    $conn->rollBack();
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

// Close the connection
$conn = null;
?>
