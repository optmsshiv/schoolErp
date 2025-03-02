<?php
require '../db_connection.php'; // Include your database connection

$class_name = $_GET['class_name'] ?? ''; // Get class_name from request

if (!$class_name) {
    echo json_encode(['error' => 'Class name is required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT month_name, amount, fee_head_name FROM FeePlans WHERE class_name = ?");
    $stmt->execute([$class_name]);
    $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($feePlans);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
