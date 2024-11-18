<?php
// Include database connection
require_once '../db_connection.php';

// Initialize response array
$response = [
    'status' => 'error',
    'message' => 'No data found',
    'data' => []
];

// Query to fetch fee plans
$query = "SELECT fee_head_name, class_name, month_name, amount FROM FeePlans ORDER BY class_name ASC";

// Execute the query
$result = mysqli_query($conn, $query);

if ($result && mysqli_num_rows($result) > 0) {
    // Prepare an array to hold the fee plan data
    $feePlans = [];

    // Fetch each fee plan from the result
    while ($row = mysqli_fetch_assoc($result)) {
        $feePlans[] = [
            'fee_head' => $row['fee_head_name'],
            'class' => $row['class_name'],
            'month' => $row['month_name'],
            'fee_amount' => $row['amount']
        ];
    }

    // Set the success response with the fee plans data
    $response['status'] = 'success';
    $response['message'] = 'Data fetched successfully';
    $response['data'] = $feePlans;
} else {
    // If no data found, set message
    $response['message'] = 'No fee plans found';
}

// Close the database connection
mysqli_close($conn);

// Output the response in JSON format
echo json_encode($response);
?>
