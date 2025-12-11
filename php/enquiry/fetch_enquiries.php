<?php
// fetch_enquiries.php
global $pdo;
header('Content-Type: application/json');
require '../db_connection.php';

// GET params
$page = max(1, (int)($_GET['page'] ?? 1));
$page_size = max(1, min(100, (int)($_GET['page_size'] ?? 10)));
$q = trim($_GET['q'] ?? '');

$offset = ($page - 1) * $page_size;

try {
  $params = [];
  $where = "1=1";
  if ($q !== '') {
    $where .= " AND (first_name LIKE :q OR last_name LIKE :q OR mobile LIKE :q OR enquiry_no LIKE :q OR class_name LIKE :q)";
    $params[':q'] = "%$q%";
  }

  // total count
  $countSql = "SELECT COUNT(*) FROM admission_enquiry WHERE $where";
  $countStmt = $pdo->prepare($countSql);
  $countStmt->execute($params);
  $total = (int)$countStmt->fetchColumn();
  $total_pages = (int)ceil($total / $page_size);

  // fetch rows
  $sql = "SELECT id, enquiry_no, first_name, last_name,father_name,mother_name, mobile, class_name,dob,gender,address, enquiry_date, created_by, created_by_name FROM admission_enquiry WHERE $where ORDER BY created_at DESC LIMIT :offset, :limit";
  $stmt = $pdo->prepare($sql);
  foreach ($params as $k=>$v) $stmt->bindValue($k, $v);
  $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
  $stmt->bindValue(':limit', (int)$page_size, PDO::PARAM_INT);
  $stmt->execute();
  $rows = $stmt->fetchAll();

  echo json_encode(['status'=>'success','data'=>$rows,'total'=>$total,'page'=>$page,'page_size'=>$page_size,'total_pages'=>$total_pages]);
} catch (Exception $e) {
  echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}
