<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../db_connection.php'; // Database connection

header('Content-Type: application/json');

try {
    // Fetch WhatsApp API credentials from the database
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

    if (!isset($data['fullName'], $data['user_id'], $data['phone'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    // Extract user details
    $fullName = $data['fullName'];
    $userId = $data['user_id'];
    $phone = $data['phone'];
    $fromName = "OPTMS Tech"; // Modify as needed

    // Function to generate a random password
    function generateRandomPassword($length = 8) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $password;
    }

    // Generate a new password and hash it
    $newPassword = generateRandomPassword();
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT); // Secure password storage

    // Update password in the database
    $stmt = $pdo->prepare("UPDATE userRole SET password = ? WHERE user_id = ?");
    if (!$stmt->execute([$hashedPassword, $userId])) {
        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
        exit;
    }

    // Prepare WhatsApp API request payload
    $messageData = [
        "messaging_product" => "whatsapp",
        "to" => $phone,
        "type" => "template",
        "template" => [
            "name" => "user_role", // Ensure this template is approved in Meta
            "language" => ["code" => "en_US"],
            "components" => [
                [
                    "type" => "body",
                    "parameters" => [
                        ["type" => "text", "text" => $fullName],
                        ["type" => "text", "text" => $userId],
                        ["type" => "text", "text" => $newPassword], // Send the generated password
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

    // Decode response for logging
    $responseData = json_decode($response, true);
    $messageStatus = ($httpCode == 200 || $httpCode == 201) ? 'success' : 'failed';

    // Log the response in the database
    $logStmt = $pdo->prepare("INSERT INTO whatsapp_log (phone, fullname, userId, message_status, response) VALUES (:phone, :fullname, :userId, :message_status, :response)");
    $logStmt->execute([
        ':phone' => $phone,
        ':fullname' => $fullName,
        ':userId' => $userId,
        ':message_status' => $messageStatus,
        ':response' => json_encode($responseData)
    ]);

    if ($messageStatus === 'success') {
        echo json_encode(['success' => true, 'message' => 'WhatsApp message sent', 'response' => $responseData]);
    } else {
        echo json_encode(['success' => false, 'message' => 'WhatsApp API error', 'response' => $responseData]);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
