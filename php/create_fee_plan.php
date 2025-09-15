<?php
global $pdo;
include '../php/db_connection.php'; // your PDO connection

// Fetch Fee Heads
$feeHeadsStmt = $pdo->query("SELECT fee_head_id, fee_head_name FROM FeeHeads ORDER BY fee_head_name ASC");
$FeeHeads = $feeHeadsStmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch Classes
$classesStmt = $pdo->query("SELECT class_id, class_name FROM Classes ORDER BY class_name ASC");
$Classes = $classesStmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  "FeeHeads" => $FeeHeads,
  "Classes" => $Classes
]);
