<?php
// Include the database connection file
global $pdo;
header('Content-Type: application/json');
include '../db_connection.php';

try {
  $stmt = $pdo->query("
        SELECT
            fp.fee_plan_id,     -- for fetch fee plan id
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
        WHERE fp.is_deleted = 0 AND fp.deleted_at IS NULL
        ORDER BY c.class_name, fh.fee_head_name, fp.month_name
    ");

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
