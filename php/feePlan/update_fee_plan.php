<?php
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['fee_plan_id'])) {
  echo json_encode(["status" => "error", "message" => "Invalid request"]);
  exit;
}

try {
  $stmt = $pdo->prepare("
    UPDATE FeePlans
    SET class_id = :class_id,
        fee_head_id = :fee_head_id,
        month_name = :month_name,
        amount = :amount,
        updated_at = NOW()
    WHERE fee_plan_id = :fee_plan_id
  ");

  $stmt->execute([
    ':class_id'    => $data['class_id'],
    ':fee_head_id' => $data['fee_head_id'],
    ':month_name'  => $data['month_name'],
    ':amount'      => $data['fee_amount'],
    ':fee_plan_id' => $data['fee_plan_id']
  ]);

  echo json_encode(["status" => "success", "message" => "Fee Plan updated successfully"]);
} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
