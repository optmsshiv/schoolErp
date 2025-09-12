<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
  $id = intval($data['id']);
  $class_id = intval($data['class_id']);
  $fee_head_id = intval($data['fee_head_id']);
  $fee_amount = floatval($data['fee_amount']);
  $month_name = $data['month_name'];

  try {
    $stmt = $pdo->prepare("UPDATE FeePlans
                               SET class_name = ?, fee_head_name = ?, amount = ?, month_name = ?, updated_at = NOW()
                               WHERE fee_plan_id = ?");
    $stmt->execute([$class_id, $fee_head_id, $fee_amount, $month_name, $id]);

    echo json_encode(["status" => "success", "message" => "Fee Plan updated successfully"]);
  } catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
  }
} else {
  echo json_encode(["status" => "error", "message" => "Invalid Data"]);
}
