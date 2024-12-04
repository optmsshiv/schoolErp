<?php
// Include the database connection
require_once '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data from the AJAX request
    $feeHeadId = $_POST['fee_head_id'];
    $feeAmount = $_POST['fee_amount'];

    try {
        // Fetch the fee head name based on fee_head_id
        $stmt = $pdo->prepare("SELECT fee_head_name FROM Feeheads WHERE id = :fee_head_id");
        $stmt->execute(['fee_head_id' => $feeHeadId]);
        $feeHead = $stmt->fetch();

        if ($feeHead) {
            // Insert data into FeeCollection table
            $insertStmt = $pdo->prepare("INSERT INTO FeeCollection (fee_type, total) VALUES (:fee_type, :total)");
            $insertStmt->execute([
                'fee_type' => $feeHead['fee_head_name'],
                'total' => $feeAmount
            ]);

            // Respond with success
            echo json_encode([
                'status' => 'success',
                'message' => 'Fee saved successfully',
                'data' => [
                    'fee_type' => $feeHead['fee_head_name'],
                    'total' => $feeAmount,
                    'id' => $pdo->lastInsertId() // Return the ID of the inserted row
                ]
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Fee head not found']);
        }
    } catch (PDOException $e) {
        // Log error and respond with failure
        error_log('Error saving fee: ' . $e->getMessage(), 0);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save fee']);
    }
}
?>
