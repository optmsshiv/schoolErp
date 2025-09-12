<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["status" => "error", "message" => "Invalid input"]);
  exit;
}

$fee_head_id = $data["fee_head_id"];
$class_id = $data["class_id"];
$fee_amount = $data["fee_amount"];
$months = $data["months"]; // array of selected months

try {
  $pdo->beginTransaction();

  $stmt = $pdo->prepare("INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount) VALUES (?, ?, ?, ?)");
  foreach ($months as $month) {
    $stmt->execute([$fee_head_id, $class_id, $month, $fee_amount]);
  }

  $pdo->commit();
  echo json_encode(["status" => "success"]);
} catch (Exception $e) {
  $pdo->rollBack();
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
