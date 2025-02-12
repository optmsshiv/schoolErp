<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '/php/db_connection.php'; // Database connection

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("SELECT access_token, phone_number_id FROM whatsapp_credentials WHERE service_name = 'whatsapp' LIMIT 1");
    $stmt->execute();
    $credentials = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($credentials) {
        echo json_encode([
            'success' => true,
            'access_token' => $credentials['access_token'],
            'phone_number_id' => $credentials['phone_number_id']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Credentials not found']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
