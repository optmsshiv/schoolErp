<?php
require 'db_connection.php'; // Ensure you have a database connection file

header('Content-Type: application/json');

if (!isset($_GET['userId'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

$userId = $_GET['userId'];

// Fetch fee plans from FeePlans table
$feePlansQuery = $pdo->prepare("SELECT fee_head_name, amount FROM FeePlans WHERE userId = ?");
$feePlansQuery->execute([$userId]);
$feePlans = $feePlansQuery->fetchAll(PDO::FETCH_ASSOC);

// Fetch fee payment status from feeDetails table
$feeDetailsQuery = $pdo->prepare("SELECT month, payment_status FROM feeDetails WHERE userId = ?");
$feeDetailsQuery->execute([$userId]);
$feeDetails = $feeDetailsQuery->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'feePlans' => $feePlans, 'feeDetails' => $feeDetails]);
?>
