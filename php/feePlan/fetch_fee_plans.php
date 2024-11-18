<?php
// Include the database connection
include '../db_connection.php'; // Make sure the path to db_connection.php is correct

// SQL query to fetch fee plans
$sql = "SELECT feeHead.fee_head_id, feeHead.fee_head_name AS fee_head, feePlan.class, feePlan.month, feePlan.fee_amount
        FROM feePlan
        JOIN feeHead ON feePlan.fee_head_id = feeHead.fee_head_id
        ORDER BY feePlan.class, feePlan.month";

// Execute the query
$result = $conn->query($sql);

// Check if there are any results
if ($result->num_rows > 0) {
    $feePlans = [];

    // Fetch data into an array
    while ($row = $result->fetch_assoc()) {
        $feePlans[] = $row;
    }

    // Send the data as JSON
    echo json_encode(['status' => 'success', 'message' => 'Data fetched successfully', 'data' => $feePlans]);
} else {
    // No data found
    echo json_encode(['status' => 'success', 'message' => 'No data found', 'data' => []]);
}

// Close the connection
$conn->close();
?>
