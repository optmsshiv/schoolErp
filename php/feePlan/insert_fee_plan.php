<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["status" => "error", "message" => "No data received"]);
  exit;
}

try {
  $stmt = $pdo->prepare("
    INSERT INTO FeePlans (class_id, fee_head_id, month_name, amount, created_at, updated_at)
    VALUES (:class_id, :fee_head_id, :month_name, :amount, NOW(), NOW())
  ");

  foreach ($data['months'] as $month) {
    $stmt->execute([
      ':class_id'    => $data['class_id'],    // matches :class_id
      ':fee_head_id' => $data['fee_head_id'], // matches :fee_head_id
      ':month_name'  => $month,               // matches :month_name
      ':amount'      => $data['fee_amount']   // matches :amount
    ]);
  }

  echo json_encode(["status" => "success"]);
} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
