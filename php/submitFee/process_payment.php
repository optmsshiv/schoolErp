<?php
global $pdo;
require_once '../db_connection.php'; // Include your database connection

header('Content-Type: application/json');

try {
  // Get JSON input
  $inputData = json_decode(file_get_contents('php://input'), true);

  // Validate required fields
  if (!isset($inputData['receipt_no'], $inputData['months'], $inputData['amount'], $inputData['type'], $inputData['mode'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.', 'received' => $inputData]);
    exit;
  }



  $receipt_no = intval($inputData['receipt_no']);
  $months = explode(',', $inputData['months']);
  $amount = floatval($inputData['amount']);
  $type = $inputData['type'];
  $mode = $inputData['mode'];
  $paymentStatus = 'Paid'; // Assuming successful payment

  $pdo->beginTransaction();

  // Update fee details for each month
  foreach ($months as $month) {
    $stmt = $pdo->prepare("
            UPDATE feeDetails
            SET received_amount = received_amount + :amount,
                due_amount = GREATEST(due_amount - :amount, 0),
                payment_status = CASE WHEN (due_amount - :amount) <= 0 THEN 'Paid' ELSE 'Pending' END,
                payment_type = :payment_type,
                bank_name = :mode
            WHERE user_id = :receipt_no AND month = :month
        ");
    $stmt->execute([
      ':amount' => $amount / count($months), // Splitting payment among selected months
      ':payment_type' => $type,
      ':mode' => $mode,
      'receipt_no' => $receipt_no,
      ':month' => $month
    ]);
  }

  $pdo->commit();

  echo json_encode(['success' => true, 'message' => 'Payment recorded successfully.']);
} catch (Exception $e) {
  $pdo->rollBack();
  echo json_encode(['success' => false, 'message' => 'Payment failed: ' . $e->getMessage()]);
}
?>
