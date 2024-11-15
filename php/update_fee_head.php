<?php
// update_fee_head.php

// Assuming you have a connection to the database
include '../php/db_connection.php';

if (isset($_POST['oldName']) && isset($_POST['newName'])) {
    $oldName = $_POST['oldName'];
    $newName = $_POST['newName'];

    // Prevent empty new name or same as old name
    if (empty($newName) || $newName === $oldName) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid fee head name']);
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
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}

?>

