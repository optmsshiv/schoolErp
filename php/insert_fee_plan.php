<?php
// Database connection
include '../php/db_connection.php';

header('Content-Type: application/json');

// Check if the required fields are present
if (isset($_POST['feeHead'], $_POST['classId'], $_POST['monthId'], $_POST['amount'])) {
    $feeHead = $_POST['feeHead'];
    $classId = $_POST['classId'];
    $monthId = $_POST['monthId'];
    $amount = $_POST['amount'];

    // Prepare SQL query to insert the fee plan
    $sql = "INSERT INTO FeePlans (fee_head_id, class_id, month_id, amount)
            VALUES (:fee_head_id, :class_id, :month_id, :amount)";
    $stmt = $pdo->prepare($sql);

    // Bind parameters to avoid SQL injection
    $stmt->bindParam(':fee_head_id', $feeHead);
    $stmt->bindParam(':class_id', $classId);
    $stmt->bindParam(':month_id', $monthId);
    $stmt->bindParam(':amount', $amount);

    try {
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert fee plan']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
}
?>
