<?php
// Connect to the database
include '../db_connection.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch Feeheads data
    $stmt = $pdo->query("SELECT id, fee_head_name FROM Feeheads");
    $feeheads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return JSON response
    echo json_encode($feeheads);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
