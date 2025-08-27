<?php
global $pdo;
header("Content-Type: application/json");
include '../php/db_connection.php'; // your PDO connection

try {
  $stmt = $pdo->query("SELECT fee_head_id, fee_head_name FROM Feeheads ORDER BY fee_head_id DESC");
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($rows);
} catch (PDOException $e) {
  echo json_encode([]);
}
