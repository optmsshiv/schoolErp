<?php
global $pdo;
require_once '../db_connection.php'; // Include database connection

header('Content-Type: application/json');

try {
  // Get JSON input
  $inputData = json_decode(file_get_contents('php://input'), true);

  // Validate required fields
  if (!isset($inputData['receipt_no'], $inputData['months'], $inputData['amount'], $inputData['type'], $inputData['mode'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.', 'received' => $inputData]);
    exit;
  }

  $receipt_no = $inputData['receipt_no']; // Now using `receipt_no`
  $months = explode(',', $inputData['months']);
  $amount = floatval($inputData['amount']);
  $type = $inputData['type'];
  $mode = $inputData['mode'];
  $concessionAmount = floatval($inputData['concession']);
  $dueAmount = floatval($inputData['due']);

  $pdo->beginTransaction();

  // Loop through selected months
  foreach ($months as $month) {
    // Fetch existing due_amount for that receipt_no and month
    $stmt = $pdo->prepare("
            SELECT due_amount, received_amount
            FROM feeDetails
            WHERE receipt_no = :receipt_no AND month = :month
        ");
    $stmt->execute([
      ':receipt_no' => $receipt_no,
      ':month' => $month
    ]);
    $feeData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$feeData) {
      echo json_encode(['success' => false, 'message' => "No record found for receipt_no: $receipt_no and month: $month"]);
      $pdo->rollBack();
      exit;
    }

    $existingDueAmount = floatval($feeData['due_amount']);
    $existingReceivedAmount = floatval($feeData['received_amount']);

    // Calculate pending amount
    $pendingAmount = $existingDueAmount;


    // Calculate new due amount after payment
    // $newDueAmount = max($existingDueAmount - $amount, 0);
   // $newReceivedAmount = $existingReceivedAmount + $amount;

    // Calculate new due amount after payment
    $finalReceivedAmount = $existingReceivedAmount + $amount;
    $finalDueAmount = max($existingDueAmount - ($amount + $concessionAmount), 0); // Ensuring no negative values


    // Payment status should be 'Paid' even for partial payments
   // $paymentStatus = 'Paid';

    // Determine payment status
    $paymentStatus = ($finalDueAmount == 0) ? 'paid' : 'partial';

    // Update the feeDetails table
    $updateStmt = $pdo->prepare("
            UPDATE feeDetails
            SET received_amount = :new_received_amount,
                due_amount = :new_due_amount,
                concession_amount = :concession_amount,
                payment_status = :payment_status,
                payment_type = :payment_type,
                payment_type = :mode
            WHERE receipt_no = :receipt_no AND month = :month
        ");

    $updateStmt->execute([
      ':new_received_amount' => $finalReceivedAmount,
      ':new_due_amount' => $finalDueAmount,
      ':concession_amount' => $concessionAmount,
      ':payment_status' => $paymentStatus,
      ':payment_type' => $type,
      ':mode' => $mode,
      ':receipt_no' => $receipt_no,
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
