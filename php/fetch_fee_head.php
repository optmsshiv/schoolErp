<?php
// Set header to return JSON
header('Content-Type: application/json');

// Database connection details
$host = 'localhost:3306';
$db = 'edrppymy_rrgis';
$user = 'edrppymy_admin';
$pass = '13579@demo';

$dsn = "mysql:host=$host;dbname=$db";

try {
    // Create PDO instance
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch fee heads from the database
    $sql = "SELECT * FROM FeeHeads";
    $stmt = $pdo->query($sql);
    $feeHeads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return fee heads as JSON
    echo json_encode(['status' => 'success', 'data' => $feeHeads]);

} catch (PDOException $e) {
    // Return error message as JSON if connection fails
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}
?>
