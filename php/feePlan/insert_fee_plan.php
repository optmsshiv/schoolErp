<?php
require '../db_connection.php'; // Include your database connection file

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $feeHeadName = $_POST['fee_head_name'] ?? '';
    $className = $_POST['class_name'] ?? '';
    $monthName = $_POST['month_name'] ?? '';
    $amount = $_POST['amount'] ?? '';

    // Validate input
    if (empty($feeHeadName) || empty($className) || empty($monthName) || empty($amount)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    try {
        // Insert data into the database
        $stmt = $conn->prepare("INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('sssi', $feeHeadName, $className, $monthName, $amount);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Fee plan created successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create fee plan.']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
