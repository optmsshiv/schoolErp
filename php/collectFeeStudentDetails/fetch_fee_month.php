<?php
require 'db_connection.php'; // Your database connection file

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(['error' => 'User ID is required']);
    exit;
}

// Fetch Fee Plan for the student
$sql = "SELECT * FROM FeePlans WHERE user_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);
$feePlan = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$feePlan) {
    echo json_encode(['error' => 'No fee plan found for this user']);
    exit;
}

// Fetch Fee Payment Details
$sqlPaid = "SELECT month, status FROM feeDetails WHERE user_id = ?";
$stmtPaid = $pdo->prepare($sqlPaid);
$stmtPaid->execute([$user_id]);
$paidFees = $stmtPaid->fetchAll(PDO::FETCH_ASSOC);

// Convert paid status into an easy-to-use format
$paidStatus = [];
foreach ($paidFees as $fee) {
    $paidStatus[$fee['month']] = $fee['status']; // Assuming 1 = Paid, 0 = Unpaid
}

echo json_encode([
    'monthly_fee' => $feePlan['monthly_fee'],
    'paid_status' => $paidStatus
]);
?>
