<?php
// Assuming you have a PDO connection set up
include_once 'db_connection.php';
include_once 'send_email_or_sms.php';  // Include email/SMS sending logic

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_POST['user_id'];
    $status = $_POST['status'];

    // Update user status
    $query = "UPDATE userRole SET status = :status WHERE user_id = :user_id";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['status' => $status, 'user_id' => $userId]);

    // Send email or SMS notification
    sendStatusNotification($userId, $status);

    // Log status change in audit log
    logStatusChange($userId, $status);

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

// Function to log status changes
function logStatusChange($userId, $status) {
    global $pdo;
    $changedBy = 1; // Assuming admin id from session or similar

    $stmt = $pdo->prepare("INSERT INTO audit_log (user_id, action, old_status, new_status, changed_by, changed_at)
                           VALUES (:user_id, 'Status Change', :old_status, :new_status, :changed_by, NOW())");
    $stmt->execute([
        ':user_id' => $userId,
        ':old_status' => 'PreviousStatus',  // You would need to fetch the current status first
        ':new_status' => $status,
        ':changed_by' => $changedBy
    ]);
}
?>
