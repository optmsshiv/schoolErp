<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

try {
  $sql = "SELECT fp.fee_plan_id, c.class_name, fh.fee_head_name, fp.month_name, fp.amount, fp.created_at, fp.updated_at
            FROM FeePlans fp
            JOIN Classes c ON fp.class_name = c.class_id
            JOIN FeeHeads fh ON fp.fee_head_name = fh.fee_head_id
            ORDER BY fp.fee_plan_id DESC";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(["status" => "success", "data" => $feePlans]);
} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
