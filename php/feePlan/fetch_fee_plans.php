<?php
require '../db_connection.php';

try {
    $stmt = $conn->query("SELECT * FROM FeePlans ORDER BY created_at DESC");
    $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($feePlans);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
