<?php
// fetch_users.php
include_once '../db_connection.php';

$query = "SELECT * FROM userRole";
$stmt = $pdo->prepare($query);
$stmt->execute();

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($users);
?>
