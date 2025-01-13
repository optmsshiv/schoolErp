<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php';  // Ensure $pdo is available

try {
    // Get the user ID from the request
    $userId = $_GET['user_id'] ?? 0;

    // Validate user ID
    if (!filter_var($userId, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
        throw new Exception('Invalid user ID');
    }

    // Fetch fee details, with status derived from the pending amount
    $feeQuery = $pdo->prepare("
        SELECT
            receipt_no AS receiptId,
            month,
            due_amount AS dueAmount,
            received_amount AS receivedAmount,
            total_amount AS totalAmount,
            CASE
                WHEN received_amount = 0 THEN 'Paid'
                ELSE 'Pending'
            END AS status
        FROM feeDetails
        WHERE user_id = :userId AND active = 1
    ");
    $feeQuery->bindParam(':userId', $userId, PDO::PARAM_INT);
    $feeQuery->execute();
    $feeDetails = $feeQuery->fetchAll(PDO::FETCH_ASSOC);

    // Aggregate fee data
    $totalPaid = 0;
    $pendingAmount = 0;

    foreach ($feeDetails as $fee) {
        $totalPaid += (float)($fee['receivedAmount'] ?? 0);
        if ($fee['status'] === 'Pending') {
            $pendingAmount += (float)($fee['receivedAmount'] ?? 0); // Add to pending if status is "Pending"
        }
    }

    // Example calculations for hostel and transport amounts
    $hostelAmount = 0;
    $transportAmount = 0;

    // If needed, calculate hostel and transport amounts
    $hostelQuery = $pdo->prepare("
        SELECT SUM(hostel_fee) AS hostelAmount
        FROM hostels
        WHERE user_id = :userId
    ");
    $hostelQuery->bindParam(':userId', $userId, PDO::PARAM_INT);
    $hostelQuery->execute();
    $hostelAmount = $hostelQuery->fetchColumn() ?? 0;

    $transportQuery = $pdo->prepare("
        SELECT SUM(transport_fee) AS transportAmount
        FROM transport
        WHERE user_id = :userId
    ");
    $transportQuery->bindParam(':userId', $userId, PDO::PARAM_INT);
    $transportQuery->execute();
    $transportAmount = $transportQuery->fetchColumn() ?? 0;

    // Response
    echo json_encode([
        'totalPaid' => $totalPaid,
        'pendingAmount' => $pendingAmount,
        'hostelAmount' => $hostelAmount,
        'transportAmount' => $transportAmount,
        'details' => $feeDetails,
    ]);

} catch (Exception $e) {
    // Log the error to a file for debugging
    error_log($e->getMessage(), 3, '../logs/errors.log');

    // Respond with a generic error message to the client
    echo json_encode(['error' => 'An unexpected error occurred. Please try again later.']);
}
?>
