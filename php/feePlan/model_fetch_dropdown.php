<?php
// fetch_dropdowns.php
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

try {
  // Fetch all classes
  $classesStmt = $pdo->query("SELECT class_id, class_name FROM Classes ORDER BY class_name ASC");
  $classes = $classesStmt->fetchAll(PDO::FETCH_ASSOC);

  // Fetch all fee heads
  $feeHeadsStmt = $pdo->query("SELECT fee_head_id, fee_head_name FROM FeeHeads ORDER BY fee_head_name ASC");
  $feeHeads = $feeHeadsStmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    "Classes" => $classes,
    "FeeHeads" => $feeHeads
  ]);
} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
