<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

$stmt = $pdo->query("
  SELECT fp.fee_plan_id, fh.fee_head_name, c.class_name, fp.amount, GROUP_CONCAT(fpm.month) as months
  FROM FeePlans fp
  JOIN FeeHeads fh ON fp.fee_head_id = fh.fee_head_id
  JOIN Classes c ON fp.class_id = c.class_id
  LEFT JOIN FeePlanMonths fpm ON fp.fee_plan_id = fpm.fee_plan_id
  GROUP BY fp.fee_plan_id
  ORDER BY c.class_name, fh.fee_head_name
");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
