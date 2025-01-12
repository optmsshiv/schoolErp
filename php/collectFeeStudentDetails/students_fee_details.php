<?php
// Include database connection
require_once '../db_connection.php';

try {

    // Fetch fee details
    $feeQuery = $pdo->prepare("
        SELECT
            receipt_no AS receiptId, month, due_amount AS dueAmount,
            pending_amount AS pendingAmount, received_amount AS receivedAmount,
            total_amount AS totalAmount,
            CASE WHEN pending_amount = 0 THEN 'Paid' ELSE 'Pending' END AS status
        FROM feeDetails
        WHERE active = 1
    ");
    $feeQuery->execute();
    $feeDetails = $feeQuery->fetchAll();

    // Aggregate fee data for cards
    $totalPaid = 0;
    $pendingAmount = 0;

    foreach ($feeDetails as $fee) {
        $totalPaid += $fee['receivedAmount'] ?? 0;
        $pendingAmount += $fee['pendingAmount'] ?? 0;
    }

    // Fetch additional aggregated data
    $hostelQuery = $pdo->prepare("SELECT SUM(hostel_fee) AS hostelAmount FROM hostels WHERE active = 1");
    $hostelQuery->execute();
    $hostelAmount = $hostelQuery->fetchColumn() ?? 0;

    $transportQuery = $pdo->prepare("SELECT SUM(transport_fee) AS transportAmount FROM transport WHERE active = 1");
    $transportQuery->execute();
    $transportAmount = $transportQuery->fetchColumn() ?? 0;

    // Response structure
    $response = [
        "students" => $students,
        "fee" => [
            "totalPaid" => $totalPaid,
            "pendingAmount" => $pendingAmount,
            "hostelAmount" => $hostelAmount,
            "transportAmount" => $transportAmount,
            "details" => $feeDetails
        ]
    ];

    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response);

} catch (PDOException $e) {
    // Handle errors gracefully
    error_log('Database query failed: ' . $e->getMessage(), 0);

    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch data. Please try again later.'
    ]);
}
?>
