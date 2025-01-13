<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php';  // Assumes $pdo is initialized in db_connection.php

try {
    // Get the student ID (or other identifying parameter) from the request
    $user_id = $_GET['user_id'] ?? null;

    if (!$user_id) {
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }

    // Fetch aggregate fee details (total paid, hostel, transport)
    $summaryQuery = "
        SELECT
            COALESCE(SUM(fd.amount), 0) AS total_paid_amount,
            COALESCE(h.hostel_fee, 0) AS hostel_amount,
            COALESCE(t.transport_fee, 0) AS transport_amount
        FROM
            feeDetails fd
        LEFT JOIN
            students s ON fd.user_id = s.user_id
        LEFT JOIN
            hostels h ON s.hostel_id = h.hostel_id
        LEFT JOIN
            transport t ON s.transport_id = t.transport_id
        WHERE
            fd.user_id = :user_id
    ";
    $summaryStmt = $pdo->prepare($summaryQuery);
    $summaryStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $summaryStmt->execute();
    $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

    // Fetch detailed fee records
    $detailsQuery = "
        SELECT
            fd.receipt_no,
            fd.month,
            fd.due_amount,
            fd.received_amount,
            fd.total_amount,
            CASE WHEN fd.received_amount >= fd.total_amount THEN 'Paid' ELSE 'Pending' END AS status
        FROM
            feeDetails fd
        WHERE
            fd.user_id = :user_id
    ";
    $detailsStmt = $pdo->prepare($detailsQuery);
    $detailsStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $detailsStmt->execute();
    $details = $detailsStmt->fetchAll(PDO::FETCH_ASSOC);

    // Combine summary and details into a response
    $response = [
        'summary' => $summary,
        'details' => $details,
    ];

    // Return the response as JSON
    echo json_encode($response);
} catch (PDOException $e) {
    // Return an error response
    echo json_encode(['error' => $e->getMessage()]);
}

?>
