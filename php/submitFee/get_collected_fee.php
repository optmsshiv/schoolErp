<?php
require '../db_connection.php'; // Include your database connection

 header('Content-Type: application/json');

// Assuming you're already connected to the database
session_start();

$user_id = $_SESSION['user_id']; // Assuming student ID is stored in the session

// Query to get the list of paid months for the student
$query = "SELECT month FROM feeDetails WHERE user_id = :user_id AND payment_status = paid";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$stmt->execute();

$paidMonths = $stmt->fetchAll(PDO::FETCH_COLUMN);

// Debugging: Check what data is returned
if (empty($paidMonths)) {
    echo json_encode([]); // Return an empty array if no paid months found
} else {
    echo json_encode($paidMonths); // Return the array of paid months
}
?>
