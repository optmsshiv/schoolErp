<?php
require '..db_connection.php'; // Include database connection
require '/php/whatsapp/get_whatsapp_credentials.php'; // Include WhatsApp API integration

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $phone = $data['phone'];
    $fullName = $data['fullName'];
    $password = $data['password'];
    $fromName = $data['fromName'];

    // Construct WhatsApp message
    $message = "Hello $fullName,\n\nHere are your credentials:\nPassword: $password\n\nPlease keep this information secure.";

    // Send message via WhatsApp API
    $result = sendWhatsAppMessage($phone, $message);

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Credentials sent successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send credentials.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}
?>
