<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php';  // Ensure $pdo is available

try {
    // Get the user ID from the request
    $userId = $_GET['user_id'] ?? 0;

    // Validate user ID
    if (!$userId) {
        throw new Exception('Invalid user ID');
    }

    // Fetch fee details
    $feeQuery = $pdo->prepare("
        SELECT
            receipt_no AS receiptId,
            month,
            due_amount AS dueAmount,
            pending_amount AS pendingAmount,
            received_amount AS receivedAmount,
            total_amount AS totalAmount,
            CASE WHEN pending_amount = 0 THEN 'Paid' ELSE 'Pending' END AS status
        FROM feeDetails
        WHERE user_id = :userId AND active = 1
    ");
    $feeQuery->bindParam(':userId', $userId, PDO::PARAM_INT);
    $feeQuery->execute();
    $feeDetails = $feeQuery->fetchAll(PDO::FETCH_ASSOC);

    // Aggregate fee data
    $totalPaid = 0;
    $pendingAmount = 0;
    $hostelAmount = 0; // Example calculation, replace as needed
    $transportAmount = 0; // Example calculation, replace as needed

    foreach ($feeDetails as $fee) {
        $totalPaid += $fee['receivedAmount'] ?? 0;
        $pendingAmount += $fee['pendingAmount'] ?? 0;
    }

    // Response
    echo json_encode([
        'totalPaid' => $totalPaid,
        'pendingAmount' => $pendingAmount,
        'hostelAmount' => $hostelAmount,
        'transportAmount' => $transportAmount,
        'details' => $feeDetails,
    ]);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
