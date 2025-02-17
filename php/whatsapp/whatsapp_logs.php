<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../db_connection.php'; // Database connection

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, phone, fullname, userId, message_status, response, created_at FROM whatsapp_log ORDER BY created_at DESC");
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'logs' => $logs]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

?>
