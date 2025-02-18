<?php
// fetch_users.php
header('Content-Type: application/json'); // ✅ Ensure correct JSON output
include_once '../db_connection.php';

$query = "SELECT * FROM userRole";
$stmt = $pdo->prepare($query);
$stmt->execute();

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($users);
?>
