<?php
require '../db_connection.php'; // Include the PDO configuration

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'] ?? 0;

    try {
        $stmt = $pdo->prepare("DELETE FROM BankDetails WHERE BankID = :id");
        $stmt->execute([':id' => $id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Record not found.']);
        }
    } catch (PDOException $e) {
        error_log('Delete failed: ' . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete data.']);
    }
}
?>
