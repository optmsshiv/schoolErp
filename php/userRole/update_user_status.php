<?php
include '../db_connection.php';

if (isset($_POST['user_id']) && isset($_POST['status'])) {
    $user_id = $_POST['user_id'];
    $status = $_POST['status'];

    try {
        $stmt = $pdo->prepare("UPDATE userRole SET status = :status WHERE user_id = :user_id");
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>
