<?php
global $pdo;
require '../db_connection.php'; // Include your database connection

 header('Content-Type: application/json');

// Assuming you're already connected to the database
session_start();

// Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([]); // Return an empty array if no user is logged in
    exit;
}

$studentId = $_SESSION['user_id']; // Get the logged-in student's ID

try {
    // Query to get the list of paid months for the student
    $query = "SELECT month FROM feeDetails WHERE user_id = :user_id AND payment_status = 'paid'";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':user_id', $studentId, PDO::PARAM_INT);
    $stmt->execute();

    $paidMonths = $stmt->fetchAll(PDO::FETCH_COLUMN); // Fetch months as an array

    $paidMonths = array_map(function($month) use ($monthNames) {
        return isset($monthNames[$month]) ? $monthNames[$month] : $month;
    }, $paidMonths);

    echo json_encode($paidMonths); // Return JSON response
} catch (PDOException $e) {
    echo json_encode([]); // Return an empty array on error
}
?>
