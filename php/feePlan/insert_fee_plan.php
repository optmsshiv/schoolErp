<?php
require '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $feeHeadName = $_POST['fee_head_name'];
    $className = $_POST['class_name'];
    $monthName = $_POST['month_name'];
    $amount = $_POST['amount'];

    try {
        $stmt = $conn->prepare("
            INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount)
            VALUES (:fee_head_name, :class_name, :month_name, :amount)
        ");
        $stmt->execute([
            ':fee_head_name' => $feeHeadName,
            ':class_name' => $className,
            ':month_name' => $monthName,
            ':amount' => $amount,
        ]);

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
