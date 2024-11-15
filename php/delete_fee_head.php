<?php
// Include the database connection file
include '../php/db_connection.php';

// Set the response header to JSON
header('Content-Type: application/json');

// Check if the fee head name is set in the POST request
if (isset($_POST['feeHeadName'])) {
    $feeHeadName = trim($_POST['feeHeadName']);

    // Check if the fee head name is not empty
    if (empty($feeHeadName)) {
        echo json_encode(['status' => 'error', 'message' => 'Fee head name is required']);
        exit;
    }

    // Prepare the DELETE query using PDO
    $sql = "DELETE FROM FeeHeads WHERE fee_head_name = :fee_head_name";
    $stmt = $pdo->prepare($sql);

    // Bind the fee head name to the placeholder
    $stmt->bindParam(':fee_head_name', $feeHeadName, PDO::PARAM_STR);

    try {
        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to delete fee head']);
        }
    } catch (PDOException $e) {
        // Return the error message if the query fails
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
