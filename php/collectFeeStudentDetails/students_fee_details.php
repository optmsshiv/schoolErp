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
            COALESCE(SUM(CASE WHEN f.type = 'hostel' THEN f.amount ELSE 0 END), 0) AS hostel_amount,
            COALESCE(SUM(CASE WHEN f.type = 'transport' THEN f.amount ELSE 0 END), 0) AS transport_amount,
            COALESCE(SUM(f.amount), 0) AS total_paid_amount
        FROM
            feeDetails f
        WHERE
            f.user_id = :user_id
    ";
    $summaryStmt = $pdo->prepare($summaryQuery);
    $summaryStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $summaryStmt->execute();
    $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

    // Fetch detailed fee records
    $detailsQuery = "
        SELECT
            f.receipt_no,
            f.month,
            f.due_amount,
            f.received_amount,
            f.total_amount,
            CASE WHEN f.received_amount >= f.total_amount THEN 'Paid' ELSE 'Pending' END AS status
        FROM
            feeDetails f
        WHERE
            f.user_id = :user_id
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
