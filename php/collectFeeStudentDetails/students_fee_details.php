<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php';  // Assumes $pdo is initialized in db_connection.php

try {
    // Get the student ID (or other identifying parameter) from the request
    $user_id = $_GET['user_id'] ?? null;
    // Use this user_id to filter the database query
    // $sql = "SELECT ... WHERE s.user_id = '$user_id'";

    if (!$user_id) {
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }

    // Fetch aggregate fee details (total paid, hostel, transport)
    // COALESCE(SUM(fd.total_amount), 0) + COALESCE(SUM(fd.due_amount), 0) AS pending_amount,
    // LEFT JOIN
    //     hostels h ON s.hostel_id = h.hostel_id

    $summaryQuery = "
    SELECT
        COALESCE(SUM(CASE WHEN fd.payment_status = 'Paid' THEN fd.received_amount ELSE 0 END), 0) AS total_paid_amount,
        COALESCE(SUM(fd.hostel_fee), 0) AS hostel_amount,
        COALESCE(SUM(fd.transport_fee), 0) AS transport_amount
                 FROM
                     students s
                 LEFT JOIN (
                     SELECT
                         user_id,
                         payment_status,
                         SUM(received_amount) AS received_amount,
                         SUM(hostel_fee) AS hostel_fee,
                         SUM(transport_fee) AS transport_fee
                         FROM feeDetails
                     GROUP BY user_id, payment_status
                 ) fd ON fd.user_id = s.user_id AND fd.payment_status = 'Paid'
                 LEFT JOIN transport t ON s.transport_id = t.transport_id
                 WHERE
                     s.user_id = :user_id
                 GROUP BY
                    s.user_id;
                     ";

    $summaryStmt = $pdo->prepare($summaryQuery);
    $summaryStmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
    $summaryStmt->execute();
    $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

      // Handle case where no summary is found
    if (!$summary) {
        $summary = [
            'total_paid_amount' => 0,
            'pending_amount' => 0,
            'hostel_amount' => 0,
            'transport_amount' => 0,
        ];
    }

    // Fetch detailed fee records
$detailsQuery = "
    SELECT
        fd.receipt_no,
        fd.month,
        fd.due_amount,
        fd.advanced_amount,
        fd.total_amount,

        -- If there's an advanced amount, show the actual received amount
        CASE
            WHEN fd.advanced_amount > 0 THEN (fd.received_amount)
            WHEN fd.received_amount >= fd.total_amount THEN 0
            ELSE fd.received_amount
        END AS received_amount,

        -- Show pending amount only if there's a balance due, otherwise keep it NULL
        CASE
            WHEN fd.received_amount >= fd.total_amount THEN NULL
            WHEN fd.advanced_amount > 0 THEN NULL
            ELSE fd.total_amount - fd.received_amount
        END AS pending_amount,

        -- Status should be paid if total amount is received, otherwise pending
        CASE
            WHEN fd.received_amount >= fd.total_amount THEN 'Paid'
            ELSE 'Pending'
        END AS status

    FROM feeDetails fd
    WHERE fd.user_id = :user_id;";


    $detailsStmt = $pdo->prepare($detailsQuery);
    $detailsStmt->bindParam(':user_id', $user_id, PDO::PARAM_STR); // Bind user_id
    $detailsStmt->execute();
    $details = $detailsStmt->fetchAll(PDO::FETCH_ASSOC);

    // Handle case where no fee details are found
    if (empty($details)) {
        $details = [];
    }

    // Combine summary and details into a response
    $response = [
        'summary' => $summary,
        'details' => $details,
    ];

    // Return the response as JSON
    header('Content-Type: application/json');

    // Return the response as JSON
    echo json_encode($response);
} catch (PDOException $e) {
    // Return an error response
    echo json_encode(['error' => 'An unexpected error occurred: ' . $e->getMessage()]);
}

?>
