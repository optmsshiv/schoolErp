<?php
require '../db_connection.php';
require 'whatsapp_api.php'; // Include WhatsApp API handling

$data = json_decode(file_get_contents("php://input"), true);
$receipt_no = $data['receipt_no'];

$stmt = $pdo->prepare("SELECT * FROM feeDetails WHERE receipt_no = ?");
$stmt->execute([$receipt_no]);
$fee = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$fee) {
    echo json_encode(['success' => false, 'error' => 'Receipt not found']);
    exit;
}

// Generate Fee Receipt PDF (You should implement this function)
$receipt_link = generateFeeReceiptPDF($fee);

// Send WhatsApp message with the receipt
$message = "Hello, here is your fee receipt for Receipt No: {$fee['receipt_no']}. You can download it here: $receipt_link";
$sent = sendWhatsAppMessage($fee['phone'], $message);

echo json_encode(['success' => $sent]);
?>
