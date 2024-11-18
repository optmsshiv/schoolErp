<?php
include '../db_connection.php';

header('Content-Type: application/json');

// Get POST data from the request
$feeHead = $_POST['feeHead'] ?? null;
$className = $_POST['className'] ?? null;
$months = $_POST['months'] ?? null; // Expecting an array of months
$amount = $_POST['amount'] ?? null;

if (!$feeHead || !$className || !$months || !$amount) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required.'
    ]);
    exit;
}

// Loop through months and insert for each month
foreach ($months as $month) {
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
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
        exit;
    }
}

echo json_encode([
    'status' => 'success',
    'message' => 'Fee plan added successfully.'
]);

// Close the database connection
$conn = null;
?>
