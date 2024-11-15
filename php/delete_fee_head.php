<?php
// Include the database connection file
include '../php/db_connection.php';

header('Content-Type: application/json');

// Check if the fee head name is set
if (isset($_POST['feeHeadName'])) {
    // Get the fee head name from POST data
    $feeHeadName = trim($_POST['feeHeadName']);

    // Check if the fee head name is not empty
    if (empty($feeHeadName)) {
        echo json_encode(['status' => 'error', 'message' => 'Fee head name is required']);
        exit;
    }

    // Prepare the DELETE query
    $query = "DELETE FROM FeeHeads WHERE fee_head_name = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $feeHeadName);

    // Execute the query and handle the result
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Fee head not found']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => $stmt->error]);
    }

    // Close the statement
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Fee head name not provided']);
}

// Close the database connection
$conn->close();
?>
