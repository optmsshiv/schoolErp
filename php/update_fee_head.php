<?php
// update_fee_head.php

include '../php/db_connection.php'; // Make sure db_connection.php sets up a PDO connection as $pdo

header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Ensure $pdo is defined for PDO use
    if (!isset($pdo)) {
        throw new Exception("Database connection not established");
    }

    // Check if required POST data is set
    if (isset($_POST['oldName']) && isset($_POST['newName'])) {
        $oldName = trim($_POST['oldName']);
        $newName = trim($_POST['newName']);

        // Prevent empty or unchanged names
        if (empty($newName) || $newName === $oldName) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid fee head name']);
            exit;
        }

        // Check if new name already exists in the database
        $checkQuery = "SELECT COUNT(*) FROM FeeHeads WHERE fee_head_name = :newName";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->bindParam(':newName', $newName);
        $checkStmt->execute();
        $count = $checkStmt->fetchColumn();

        if ($count > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Fee head name already exists']);
            exit;
        }

        // Perform the update
        $updateQuery = "UPDATE FeeHeads SET fee_head_name = :newName WHERE fee_head_name = :oldName";
        $updateStmt = $pdo->prepare($updateQuery);
        $updateStmt->bindParam(':newName', $newName);
        $updateStmt->bindParam(':oldName', $oldName);

        if ($updateStmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update fee head']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
