<?php
header('Content-Type: application/json');
include_once '../db_connection.php';

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = ($page - 1) * $limit;

// Get total user count
$totalQuery = "SELECT COUNT(*) as total FROM userRole";
$totalStmt = $pdo->prepare($totalQuery);
$totalStmt->execute();
$total = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get paginated users
$query = "SELECT * FROM userRole LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($query);
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'users' => $users,
    'total' => $total
]);
?>
