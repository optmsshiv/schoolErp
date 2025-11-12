<?php
global $pdo;
header('Content-Type: application/json');
include '../db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$fee_plan_id = intval($data['fee_plan_id']);

$stmt = $pdo->prepare("UPDATE FeePlans SET is_deleted = 0, deleted_at = NULL, updated_at = NOW() WHERE fee_plan_id = ?");
if ($stmt->execute([$fee_plan_id])) {
  echo json_encode(['status' => 'success', 'message' => 'Restored successfully']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Failed to restore']);
}
?>
