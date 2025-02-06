<?php
require '../db_connection.php'; // Include your database connection

header('Content-Type: application/json');

// Initialize an empty array to hold the collected fee data
$collectedFees = [];

// Query to fetch collected fees
$sql = "SELECT user_id, MONTH(payment_date) AS month FROM feeDetails WHERE payment_status = 1"; // assuming 1 indicates payment completed
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Loop through the result set and organize the data by user_id
    while ($row = $result->fetch_assoc()) {
        $user_id = $row['user_id'];
        $month = $row['month']; // The month in which the fee was paid

        // Check if the user already exists in the collectedFees array
        if (!isset($collectedFees[$user_id])) {
            $collectedFees[$user_id] = [];
        }

        // Add the month to the collected fee months for that user
        $collectedFees[$user_id][] = $month;
    }
}

// Return the collected fee data as a JSON response
header('Content-Type: application/json');
echo json_encode($collectedFees);

// Close the database connection
$conn->close();
?>
