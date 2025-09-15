<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

$stmt = $pdo->query("
  SELECT
    fp.fee_plan_id,
    c.class_name,
    fh.fee_head_name,
    fp.month_name,
    fp.amount,
    fp.created_at,
    fp.updated_at
  FROM FeePlans fp
  JOIN Classes c ON fp.class_id = c.class_id
  JOIN FeeHeads fh ON fp.fee_head_id = fh.fee_head_id
  ORDER BY c.class_name, fh.fee_head_name
");

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
