<?php
// Include database connection
require_once '../db_connection.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        // Delete the fee record
        $stmt = $pdo->prepare("DELETE FROM FeeCollection WHERE id = :id");
        $stmt->execute(['id' => $id]);

        echo json_encode(['status' => 'success', 'message' => 'Fee deleted successfully']);
    } catch (PDOException $e) {
        error_log('Error deleting fee: ' . $e->getMessage(), 0);
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete fee']);
    }
}
?>
