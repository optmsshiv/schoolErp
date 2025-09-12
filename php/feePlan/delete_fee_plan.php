<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

if (isset($_POST['id'])) {
  $id = intval($_POST['id']);

  try {
    $stmt = $pdo->prepare("DELETE FROM feePlans WHERE fee_plan_id = ?");
    $stmt->execute([$id]);
    echo json_encode(["status" => "success", "message" => "Fee Plan deleted successfully"]);
  } catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
  }
} else {
  echo json_encode(["status" => "error", "message" => "Invalid ID"]);
}
