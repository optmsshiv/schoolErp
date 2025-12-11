<?php
// get_enquiry.php
global $pdo;
header('Content-Type: application/json');
require '../db_connection.php';

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
  echo json_encode(['status'=>'error','message'=>'Invalid id']);
  exit;
}

try {
  $stmt = $pdo->prepare("SELECT * FROM admission_enquiry WHERE id = ?");
  $stmt->execute([$id]);
  $row = $stmt->fetch();
  if (!$row) {
    echo json_encode(['status'=>'error','message'=>'Not found']);
  } else {
    echo json_encode(['status'=>'success','data'=>$row]);
  }
} catch (Exception $e) {
  echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}
