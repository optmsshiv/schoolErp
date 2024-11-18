<?php
// Include database connection
require_once '../db_connection.php';

header('Content-Type: application/json');

try {
    // Query to fetch fee plans
    $query = "
        SELECT
            fee_plan_id,
            fee_head_name,
            class_name,
            month_name,
            amount,
            created_at,
            updated_at
        FROM
            FeePlans
        ORDER BY
            class_name ASC, month_name ASC
    ";

    $result = $conn->query($query);

    $feePlans = [];

    // Check if results exist
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $feePlans[] = [
                'fee_plan_id' => $row['fee_plan_id'],
                'fee_head_name' => $row['fee_head_name'],
                'class_name' => $row['class_name'],
                'month_name' => $row['month_name'],
                'amount' => $row['amount'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at']
            ];
        }
    }

    // Send success response
    echo json_encode([
        'status' => 'success',
        'data' => $feePlans
    ]);
} catch (Exception $e) {
    // Handle errors
    echo json_encode([
        'status' => 'error',
        'message' => 'Error fetching fee plans: ' . $e->getMessage()
    ]);
}

// Close the database connection
$conn->close();
?>
