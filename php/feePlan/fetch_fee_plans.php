<?php
// Include database connection
include '../db_connection.php';

header('Content-Type: application/json');

// Initialize response array
$response = [
    'status' => 'error',
    'message' => 'No data found',
    'data' => []
];

// Query to fetch fee plans
$query = "SELECT fee_head_name, class_name, month_name, amount FROM FeePlans ORDER BY class_name ASC";

try {
    // Prepare and execute the SQL statement using PDO
    $stmt = $conn->prepare($query);
    $stmt->execute();

    // Check if any data was returned
    if ($stmt->rowCount() > 0) {
        // Prepare an array to hold the fee plan data
        $feePlans = [];

        // Fetch each fee plan from the result
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $feePlans[] = $row;
        }

        // Set the success response with the fee plans data
        $response['status'] = 'success';
        $response['message'] = 'Data fetched successfully';
        $response['data'] = $feePlans;
    } else {
        // If no data found, set message
        $response['message'] = 'No fee plans found';
    }
} catch (PDOException $e) {
    // If there was an error with the query, set the error message
    $response['message'] = 'Database error: ' . $e->getMessage();
}

// Close the database connection
$conn = null;

// Output the response in JSON format
echo json_encode($response);
?>
