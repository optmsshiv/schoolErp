<?php
header('Content-Type: application/json');
include_once '../db_connection.php';

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

$offset = ($page - 1) * $limit;

// Use a single query to fetch filtered users and total count
$query = "SELECT SQL_CALC_FOUND_ROWS * FROM userRole WHERE first_name LIKE :search LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($query);
$stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch total count (avoiding duplicate query execution)
$totalStmt = $pdo->query("SELECT FOUND_ROWS() AS total");
$total = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];

echo json_encode([
    'users' => $users,
    'total' => $total
]);
?>
