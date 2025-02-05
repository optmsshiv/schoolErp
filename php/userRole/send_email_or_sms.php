<?php
// Assuming you have email/SMS services like SendGrid or Twilio integrated

function sendStatusNotification($userId, $status) {
    global $pdo;

    // Fetch user email and phone
    $stmt = $pdo->prepare("SELECT email, phone FROM users WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($status === 'Active') {
        // Send email notification (example using PHP's mail function)
        mail($user['email'], "Your account has been activated", "Your account is now active!");

        // You can also send an SMS here using a service like Twilio
        // sendSms($user['phone'], "Your account is now active!");
    }
}
?>
