<?php
global $pdo;
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require '../db_connection.php'; // Include your DB connection

// Get class_id from request
$class_id = $_GET['class_id'] ?? '';

if (!$class_id) {
  echo json_encode(['error' => 'Class ID is required']);
  exit;
}

try {
  // Fetch fee plans for this class without ordering months
  $stmt = $pdo->prepare("
        SELECT fp.month_name, fp.amount, fh.fee_head_name
        FROM FeePlans fp
        JOIN FeeHeads fh ON fp.fee_head_id = fh.fee_head_id
        WHERE fp.class_id = ?
    ");
  $stmt->execute([$class_id]);
  $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($feePlans);
} catch (PDOException $e) {
  echo json_encode(['error' => $e->getMessage()]);
}
