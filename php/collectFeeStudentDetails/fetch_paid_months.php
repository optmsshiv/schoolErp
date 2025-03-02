<?php
require '../db_connection.php'; // Your PDO database connection

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(['error' => 'User ID is required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT month_name FROM feeDetails WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $paidMonths = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($paidMonths);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
