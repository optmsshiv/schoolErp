<?php
// Fetch all fee heads from the database

// Database connection
$host = 'localhost:3306';
$db = 'edrppymy_rrgis';
$user = 'edrppymy_admin';
$pass = '13579@demo';

$dsn = "mysql:host=$host;dbname=$db";

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit;
}

// Fetch fee heads from the database
$sql = "SELECT * FROM FeeHeads";
$stmt = $pdo->query($sql);
$feeHeads = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return fee heads as JSON
echo json_encode(['data' => $feeHeads]);
?>
