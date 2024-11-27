<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Get the POST data
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    $feeHeadName = isset($_POST['fee_head_name']) ? $_POST['fee_head_name'] : null;
    $className = isset($_POST['class_name']) ? $_POST['class_name'] : null;
    $monthName = isset($_POST['month_name']) ? $_POST['month_name'] : null;
    $amount = isset($_POST['amount']) ? $_POST['amount'] : null;

    if (!$id || !$feeHeadName || !$className || !$monthName || !$amount) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }

    // Update the fee plan record
    $sql = "UPDATE FeePlans SET fee_head_name = :fee_head_name, class_name = :class_name, month_name = :month_name, amount = :amount, updated_at = NOW() WHERE fee_plan_id = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':fee_head_name', $feeHeadName, PDO::PARAM_STR);
    $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);
    $stmt->bindParam(':month_name', $monthName, PDO::PARAM_STR);
    $stmt->bindParam(':amount', $amount, PDO::PARAM_INT);

    $stmt->execute();

    // Respond with success message
    echo json_encode(['status' => 'success', 'message' => 'Fee plan updated successfully']);
} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
