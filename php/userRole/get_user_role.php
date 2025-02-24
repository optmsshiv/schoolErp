<?php
header('Content-Type: application/json');
include_once '../db_connection.php';

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$search = isset($_GET['search']) ? trim($_GET['search']) : "";

$offset = ($page - 1) * $limit;

// Modify SQL query to filter results if search input is provided
if ($search !== "") {
    $query = "SELECT * FROM userRole WHERE fullname LIKE :search OR role LIKE :search LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
} else {
    $query = "SELECT * FROM userRole LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($query);
}

$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get the total number of records
$totalQuery = "SELECT COUNT(*) FROM userRole";
$totalStmt = $pdo->prepare($totalQuery);
$totalStmt->execute();
$total = $totalStmt->fetchColumn();

echo json_encode(["users" => $users, "total" => $total]);
?>
