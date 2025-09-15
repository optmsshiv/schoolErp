<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

try {
  $stmt = $pdo->query("
        SELECT
            fee_plan_id,
            fee_head_name,
            class_name,
            month_name,
            amount,
            created_at,
            updated_at
        FROM FeePlans
        ORDER BY class_name, fee_head_name, month_name
    ");

  $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($plans);

} catch (PDOException $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}
