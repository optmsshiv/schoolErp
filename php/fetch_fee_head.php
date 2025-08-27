<?php
global $pdo;
header('Content-Type: application/json');

// Include the DB connection
include '../db_connection.php';

try {
  // Fetch fee heads from the database
  $sql = "SELECT * FROM FeeHeads";
  $stmt = $pdo->query($sql);
  $feeHeads = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(['status' => 'success', 'data' => $feeHeads]);

} catch (PDOException $e) {
  echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
  exit;
}
