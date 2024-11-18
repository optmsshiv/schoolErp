<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Prepare SQL query to fetch fee plans
$sql = "SELECT * FROM feePlans";

// Execute the query and fetch results
try {
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Fetch all the results into an associative array
        $feePlans = [];
        while ($row = $result->fetch_assoc()) {
            $feePlans[] = $row;
        }

        // Return the fetched fee plans as JSON
        echo json_encode(['status' => 'success', 'data' => $feePlans]);
    } else {
        // No records found
        echo json_encode(['status' => 'error', 'message' => 'No fee plans found.']);
    }
} catch (Exception $e) {
    // Handle any errors during the query execution
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

// Close the database connection
$conn->close();
?>
