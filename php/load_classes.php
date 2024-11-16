<?php
// Fetch classes from the database
include '../php/db_connection.php';

$sql = "SELECT class_id, class_name FROM Classes";
$stmt = $pdo->query($sql);

$classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['status' => 'success', 'data' => $classes]);
?>
