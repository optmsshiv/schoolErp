<?php
global $pdo;
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php';  // Assumes $pdo is initialized in db_connection.php

try {
  // Get the student ID from the request
  $user_id = $_GET['user_id'] ?? null;

  if (!$user_id) {
    echo json_encode(['error' => 'User ID is required']);
    exit;
  }

  // Fetch aggregate fee details (total paid, pending, hostel, transport)
  $summaryQuery = "
    SELECT
        COALESCE(SUM(CASE WHEN fd.payment_status = 'Paid' THEN fd.received_amount ELSE 0 END), 0) AS total_paid_amount,
        COALESCE(SUM(fd.pending_amount), 0) AS pending_amount,
        COALESCE(SUM(fd.hostel_fee), 0) AS hostel_amount,
        COALESCE(SUM(fd.transport_fee), 0) AS transport_amount
    FROM students s
    LEFT JOIN feeDetails fd ON fd.user_id = s.user_id
    WHERE s.user_id = :user_id
    GROUP BY s.user_id;
    ";

  $summaryStmt = $pdo->prepare($summaryQuery);
  $summaryStmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
  $summaryStmt->execute();
  $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);

  // If no summary found, return default values
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
        fd.received_amount,
        fd.pending_amount,
        fd.total_amount,
        fd.payment_status
    FROM feeDetails fd
    WHERE fd.user_id = :user_id;
    ";

  $detailsStmt = $pdo->prepare($detailsQuery);
  $detailsStmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
  $detailsStmt->execute();
  $details = $detailsStmt->fetchAll(PDO::FETCH_ASSOC);

  // Prepare final response
  $response = [
    'summary' => $summary,
    'details' => $details ?: [],  // Ensure empty array if no data
  ];

  // Return JSON response
  header('Content-Type: application/json');
  echo json_encode($response);
} catch (PDOException $e) {
  // Return an error response
  echo json_encode(['error' => 'An unexpected error occurred: ' . $e->getMessage()]);
}
?>
