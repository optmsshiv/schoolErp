<?php
// get_user_role.php
header('Content-Type: application/json'); // Ensure JSON response
include_once '../db_connection.php';

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

// Fetch paginated users
$query = "SELECT * FROM userRole LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
$stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get total user count
$totalQuery = "SELECT COUNT(*) as total FROM userRole";
$totalStmt = $pdo->query($totalQuery);
$total = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];

echo json_encode([
    'users' => $users,
    'total' => $total
]);
?>
