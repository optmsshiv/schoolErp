<?php
require '../php/db_connection.php'; // Include your DB connection

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);
error_reporting(0); // Suppress all warnings and notices

// Meta API credentials (use environment variables for security)
$accessToken = getenv('EAAX3BfPtyaEBO78sPtDJBFN5ohbw60KTdZAtyJoLparqkQ2yr6BZAi9hb9w6wxfkKRlZBKwpI1wj4pb8Vmno2byJTLOHsf1E8xZBbdE0j0TTsukko5xPlsPRnwL835qnpckTJq22zwYkQaaQeLfnJZCEmc2WEjZB9qMRZCDhNmlgQYeYxJRLiZCmlEaGsZC69oquImjAcQSkGE9fNZC4yqPKR17scF4wm6ZAKrvnSOrP8bYvjsZD'); // Set this in your environment
$phoneNumberId = getenv('363449376861068'); // Set this in your environment

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['user_id']) || empty(trim($_POST['user_id']))) {
        echo json_encode(['success' => false, 'message' => 'Missing or invalid user ID.']);
        exit;
    }

    $user_id = trim($_POST['user_id']);

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

        // Prepare dynamic data
        $userPhoneNumber = $student['phone'];
        $userName = $student['first_name'];
        $defaultPassword = $student['default_password'];
        $fromName = 'OPTMS Tech'; // Change this to your organization's name or dynamic value

        // Send WhatsApp message
        $url = "https://graph.facebook.com/v21.0/$phoneNumberId/messages";

        $data = [
            "messaging_product" => "whatsapp",
            "to" => $userPhoneNumber,
            "type" => "template",
            "template" => [
                "name" => "message", // Approved template name
                "language" => ["code" => "en_US"],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => [
                            ["type" => "text", "text" => $userName],        // Placeholder {{1}}
                            ["type" => "text", "text" => $user_id],        // Placeholder {{2}}
                            ["type" => "text", "text" => $defaultPassword], // Placeholder {{3}}
                            ["type" => "text", "text" => $fromName]        // Placeholder {{4}}
                        ]
                    ]
                ]
            ]
        ];

        $options = [
            'http' => [
                'header' => "Content-Type: application/json\r\n" .
                            "Authorization: Bearer $accessToken\r\n",
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

        // Decode and handle response
        $responseJson = json_decode($response, true);
        if (isset($responseJson['error'])) {
            error_log("WhatsApp API Error: " . json_encode($responseJson['error']));
            echo json_encode(['success' => false, 'message' => 'WhatsApp API Error: ' . $responseJson['error']['message']]);
            exit;
        }

        echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    } catch (Exception $e) {
        error_log("General error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
