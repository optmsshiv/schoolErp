<?php
// update_fee_head.php

include '../php/db_connection.php';

header('Content-Type: application/json');

if (isset($_POST['oldName']) && isset($_POST['newName'])) {
    $oldName = trim($_POST['oldName']);
    $newName = trim($_POST['newName']);

    // Prevent empty new name or same as old name
    if (empty($newName) || $newName === $oldName) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid fee head name']);
        exit;
    }

    // Check for duplicate new name
    $checkQuery = "SELECT COUNT(*) FROM fee_heads WHERE fee_head_name = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param("s", $newName);
    $checkStmt->execute();
    $checkStmt->bind_result($count);
    $checkStmt->fetch();
    $checkStmt->close();

    if ($count > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Fee head name already exists']);
        exit;
    }

    // Update query
    $query = "UPDATE fee_heads SET fee_head_name = ? WHERE fee_head_name = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $newName, $oldName);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update fee head']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
