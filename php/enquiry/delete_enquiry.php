<?php
// delete_enquiry.php
global $pdo;
header('Content-Type: application/json');
require '../db_connection.php';
session_start();

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
  echo json_encode(['status'=>'error','message'=>'Invalid id']);
  exit;
}

try {
  $stmt = $pdo->prepare("DELETE FROM admission_enquiry WHERE id = ?");
  $stmt->execute([$id]);
  echo json_encode(['status'=>'success','message'=>'Record deleted']);
} catch (Exception $e) {
  echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}
