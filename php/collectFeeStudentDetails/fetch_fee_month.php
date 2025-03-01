<?php
require 'db_connection.php'; // Ensure you have a database connection file

header('Content-Type: application/json');

if (!isset($_GET['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

$user_id = $_GET['user_id'];

// Fetch fee plans from FeePlans table
$feePlansQuery = $pdo->prepare("SELECT fee_head_name, amount FROM FeePlans WHERE user_id = ?");
$feePlansQuery->execute([$user_id]);
$feePlans = $feePlansQuery->fetchAll(PDO::FETCH_ASSOC);

// Fetch fee payment status from feeDetails table
$feeDetailsQuery = $pdo->prepare("SELECT month, payment_status FROM feeDetails WHERE user_id = ?");
$feeDetailsQuery->execute([$user_id]);
$feeDetails = $feeDetailsQuery->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'feePlans' => $feePlans, 'feeDetails' => $feeDetails]);
?>
