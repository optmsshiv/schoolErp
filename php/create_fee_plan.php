<?php
global $pdo;
include '../php/db_connection.php'; // your PDO connection

// Fetch Fee Heads
$feeHeadsStmt = $pdo->query("SELECT fee_head_id, fee_head_name FROM feeheads ORDER BY fee_head_name ASC");
$feeheads = $feeHeadsStmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch Classes
$classesStmt = $pdo->query("SELECT class_id, class_name FROM classes ORDER BY class_name ASC");
$classes = $classesStmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  "feeheads" => $feeheads,
  "classes" => $classes
]);
