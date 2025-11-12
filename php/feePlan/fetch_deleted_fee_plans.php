<?php
global $pdo;
header('Content-Type: application/json');
include '../db_connection.php';

// Only fetch soft-deleted plans
$stmt = $pdo->query("
  SELECT fp.*, c.class_name, fh.fee_head_name
  FROM feePlans fp
  JOIN classes c ON fp.class_id = c.class_id
  JOIN feeheads fh ON fp.fee_head_id = fh.fee_head_id
  WHERE fp.is_deleted = 1 AND fp.deleted_at IS NOT NULL
  ORDER BY fp.updated_at DESC
");

$deletedPlans = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($deletedPlans);
?>
