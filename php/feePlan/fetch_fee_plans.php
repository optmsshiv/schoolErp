<?php
// Include the database connection file
global $pdo;
include '../db_connection.php';

header('Content-Type: application/json');

try {
  $stmt = $pdo->query("
        SELECT
            fp.fee_plan_id,
            fp.class_id,        -- required for dataset
            fp.fee_head_id,     -- required for dataset
            c.class_name,
            fh.fee_head_name,
            fp.month_name,
            fp.amount,
            fp.created_at,
            fp.updated_at
        FROM FeePlans fp
        JOIN Classes c ON fp.class_id = c.class_id
        JOIN FeeHeads fh ON fp.fee_head_id = fh.fee_head_id
        ORDER BY c.class_name, fh.fee_head_name, fp.month_name
    ");

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
