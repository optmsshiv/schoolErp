<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../db_connection.php'; // Database connection

header('Content-Type: application/json');

try {
    // Fetch WhatsApp API credentials from database
    $stmt = $pdo->prepare("SELECT access_token, phone_number_id FROM whatsapp_credentials WHERE service_name = 'whatsapp' LIMIT 1");
    $stmt->execute();
    $credentials = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$credentials) {
        echo json_encode(['success' => false, 'message' => 'WhatsApp credentials not found']);
        exit;
    }

    $accessToken = $credentials['access_token'];
    $phoneNumberId = $credentials['phone_number_id'];

    // Get user data from frontend (POST request)
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['fullname'], $data['user_id'], $data['password'], $data['phone'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    // Extract user details
    $fullname = $data['fullname'];
    $userId = $data['user_id'];
    $password = $data['password'];
    $phone = $data['phone'];
    $fromName = "OPTMS Tech"; // Modify as needed

    // Prepare WhatsApp API request payload
    $messageData = [
        "messaging_product" => "whatsapp",
        "to" => $phone,
        "type" => "template",
        "template" => [
            "name" => "user_role",
            "language" => ["code" => "en_US"],
            "components" => [
                [
                    "type" => "body",
                    "parameters" => [
                        ["type" => "text", "text" => $fullname],
                        ["type" => "text", "text" => $userId],
                        ["type" => "text", "text" => $password],
                        ["type" => "text", "text" => $fromName]
                    ]
                ]
            ]
        ]
    ];

    // Send request to WhatsApp API
    $url = "https://graph.facebook.com/v21.0/{$phoneNumberId}/messages";
    $headers = [
        "Authorization: Bearer $accessToken",
        "Content-Type: application/json"
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messageData));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200 || $httpCode == 201) {
        echo json_encode(['success' => true, 'message' => 'WhatsApp message sent', 'response' => json_decode($response, true)]);
    } else {
        echo json_encode(['success' => false, 'message' => 'WhatsApp API error', 'response' => json_decode($response, true)]);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

?>
