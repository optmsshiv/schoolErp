<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../db_connection.php'; // Database connection

header('Content-Type: application/json');

try {
    // Capture filter parameters
    $fromDate = isset($_GET['from']) ? $_GET['from'] : null;
    $toDate = isset($_GET['to']) ? $_GET['to'] : null;
    $phone = isset($_GET['phone']) ? $_GET['phone'] : null;

    // Base query
    $query = "SELECT id, phone, fullname, userId, message_status, response, created_at FROM whatsapp_log WHERE 1=1";
    $params = [];

    // Apply date filters (ensure correct format)
    if (!empty($fromDate)) {
        $query .= " AND DATE(created_at) >= ?";
        $params[] = date('Y-m-d', strtotime($fromDate));
    }
    if (!empty($toDate)) {
        $query .= " AND DATE(created_at) <= ?";
        $params[] = date('Y-m-d', strtotime($toDate));
    }

    // Apply phone filter
    if (!empty($phone)) {
        $query .= " AND phone LIKE ?";
        $params[] = "%$phone%";
    }

    // Order by latest logs
    $query .= " ORDER BY created_at DESC";

    // Execute query
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'logs' => $logs]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

?>
