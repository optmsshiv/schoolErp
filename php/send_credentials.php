<?php
require '../php/db_connection.php'; // Include your DB connection

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Meta API credentials
$accessToken = 'EAAX3BfPtyaEBO0Ki3JFRrZCzhHKUlyLZCZAmJOCgZBum08O6gpC5RgOO3PTFpNtFnx3f3vQR8QuGdde2JZALKFBEEpBRCDDMIfRrQYe1Dk6mbZASi4gup8yjZBZBptNrITSlOkYz1ZAP551j169PD89r6v3ZCydZBxZCZAJnMqpD9U5X2JijZCTp5FMoydpJc3gDPmwBizSCUYvHL9nuy1AKFNiaz1l3EsE9YDJcnHpayPumQZA7HoZD'; // Replace with your access token
$phoneNumberId = '363449376861068'; // Replace with your phone number ID

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];

    try {
        // Fetch student details and credentials from the database
        $stmt = $pdo->prepare("
            SELECT
                s.first_name, s.phone, a.default_password
            FROM
                students s
            JOIN
                userAuth a ON s.user_id = a.user_id
            WHERE
                s.user_id = :user_id
        ");
        $stmt->execute([':user_id' => $user_id]);
        $student = $stmt->fetch();

        if (!$student) {
            echo json_encode(['success' => false, 'message' => 'Student not found.']);
            exit;
        }

        $userPhoneNumber = $student['phone']; // User's phone number
        //$message = "Hello " . $student['first_name'] . ",\n\nYour account credentials:\n" .
        //           "User ID: " . $user_id . "\n" .
        //           "Password: " . $student['default_password'] . "\n\n" .
        //           "Please change your password after logging in.";



        // Send WhatsApp message
        $url = "https://graph.facebook.com/v21.0/$phoneNumberId/messages";

        $data = [
            "messaging_product" => "whatsapp",
            "to" => $userPhoneNumber,
            "type" => "template",
            "template" => [
                "name" => "erp_credentials",
                "language" => [
                    "code" => "en_US"
                ]
            ]
        ];

        $options = [
            'http' => [
                'header' => "Content-Type: application/json\r\nAuthorization: Bearer $accessToken\r\n",
                'method' => 'POST',
                'content' => json_encode($data),
            ],
        ];

        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);

        if ($response === FALSE) {
            echo json_encode(['success' => false, 'message' => 'Failed to send WhatsApp message.']);
            exit;
        }

        echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}
?>
