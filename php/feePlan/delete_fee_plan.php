<?php
global $pdo;
header('Content-Type: application/json');
include '../db_connection.php'; // adjust path as needed

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['fee_plan_id'])) {
  echo json_encode(['status' => 'error', 'message' => 'Missing fee plan ID']);
  exit;
}

$fee_plan_id = intval($data['fee_plan_id']);

// $stmt = $pdo->prepare("DELETE FROM FeePlans WHERE fee_plan_id = ?");
// --- Option 1: Using is_deleted flag ---
$stmt = $pdo->prepare("UPDATE FeePlans SET is_deleted = 1, deleted_at = NOW(), updated_at = NOW() WHERE fee_plan_id = ?");
$success = $stmt->execute([$fee_plan_id]);
if ($stmt->execute([$fee_plan_id])) {
  echo json_encode(['status' => 'success']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Failed to delete fee plan']);
}
