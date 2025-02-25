<?php
require '../db_connection.php'; // Ensure correct path

// Accept both GET and POST requests
$userId = $_GET['user_id'] ?? $_POST['user_id'] ?? null;

if ($userId) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM userRole WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
