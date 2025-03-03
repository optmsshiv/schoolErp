<?php
require '../db_connection.php';
require 'whatsapp_api.php';

$data = json_decode(file_get_contents("php://input"), true);
$receipt_no = $data['receipt_no'];

$stmt = $pdo->prepare("SELECT * FROM feeDetails WHERE receipt_no = ?");
$stmt->execute([$receipt_no]);
$fee = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$fee) {
    echo json_encode(['success' => false, 'error' => 'Receipt not found']);
    exit;
}

// Send WhatsApp Fee Reminder
$message = "Reminder: Your fee for {$fee['month']} is pending. Total Due: ₹{$fee['due_amount']}. Please pay at the earliest.";
$sent = sendWhatsAppMessage($fee['phone'], $message);

echo json_encode(['success' => $sent]);
?>
