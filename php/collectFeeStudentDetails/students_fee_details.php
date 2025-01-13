<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php'; // Ensure $pdo is available

header('Content-Type: application/json');

try {
    // Get the user ID from the request
    $userId = $_GET['user_id'] ?? 0;

    // Validate user ID
    if (!filter_var($userId, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
        throw new Exception('Invalid user ID');
    }

    // Fetch fee details
    $feeQuery = $pdo->prepare("
        SELECT
            receipt_no AS receipt_id,
            month,
            due_amount,
            pending_amount,
            received_amount,
            total_amount,
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
    $hostelAmount = 0; // Placeholder for hostel fee, replace with actual query if needed
    $transportAmount = 0; // Placeholder for transport fee, replace with actual query if needed

    foreach ($feeDetails as &$fee) {
        $totalPaid += (float)$fee['received_amount'];
        $pendingAmount += (float)$fee['pending_amount'];

        // Adjust pending amount based on status
        if ($fee['status'] === 'Pending') {
            $fee['pending_amount'] = $fee['received_amount'];
        }
    }

    // Example: Fetch hostel and transport fee amounts (if applicable)
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

    // Send response
    echo json_encode([
        'total_paid_amount' => $totalPaid,
        'pending_amount' => $pendingAmount,
        'hostel_amount' => $hostelAmount,
        'transport_amount' => $transportAmount,
        'feeDetails' => $feeDetails,
    ]);

} catch (Exception $e) {
    // Log the error to a file for debugging
    error_log($e->getMessage(), 3, '../logs/errors.log');

    // Send error response
    echo json_encode(['error' => 'An unexpected error occurred. Please try again later.']);
}
?>
