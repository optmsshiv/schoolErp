<?php
header('Content-Type: application/json');
include_once '../db_connection.php';

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10; // Default: 10 users per page
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// Get total count of users
$totalQuery = "SELECT COUNT(*) as total FROM userRole";
$totalStmt = $pdo->prepare($totalQuery);
$totalStmt->execute();
$totalUsers = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];
$totalPages = ceil($totalUsers / $limit);

// Get paginated users
$query = "SELECT * FROM userRole LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($query);
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return users + total pages
echo json_encode(["users" => $users, "totalPages" => $totalPages]);
?>
