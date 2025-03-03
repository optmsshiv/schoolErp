<?php
require '../db_connection.php'; // Your PDO database connection

$class_name = $_GET['class_name'] ?? '';
$user_id = $_GET['user_id'] ?? '';

if (!$class_name || !$user_id) {
    echo json_encode(['error' => 'Class name and User ID are required']);
    exit;
}

try {
    // Fetch fee plans
    $stmt = $pdo->prepare("SELECT month_name, amount, fee_head_name FROM FeePlans WHERE class_name = ?");
    $stmt->execute([$class_name]);
    $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch paid months from feeDetails
    $stmt2 = $pdo->prepare("SELECT month FROM feeDetails WHERE user_id = ? AND class_name = ?");
    $stmt2->execute([$user_id, $class_name]);
    $paidMonths = $stmt2->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'feePlans' => $feePlans,
        'paidMonths' => $paidMonths
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

