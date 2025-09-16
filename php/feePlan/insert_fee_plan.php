<?php
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
      ':class_id'    => $data['class_id'],
      ':fee_head_id' => $data['fee_head_id'],
      ':month_name'  => $month,
      ':amount'      => $data['fee_amount']
    ]);
  }

  echo json_encode(["status" => "success", "message" => "Fee Plan created successfully"]);
} catch (PDOException $e) {
  if ($e->getCode() == "23000") { // Duplicate entry
    echo json_encode([
      "status" => "warning",
      "message" => "This Fee Plan already exists for the selected class and month."
    ]);
  } else {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
  }
}
