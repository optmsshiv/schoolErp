<?php
require '../db_connection.php'; // Include database connection

$data = json_decode(file_get_contents("php://input"), true);
$receipt_no = $data['receipt_no'];

if (!$receipt_no) {
    echo json_encode(['success' => false, 'error' => 'Invalid receipt number']);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM feeDetails WHERE receipt_no = ?");
if ($stmt->execute([$receipt_no])) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
