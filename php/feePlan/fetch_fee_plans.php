<?php
require '../db_connection.php';

$query = "SELECT fee_plan_id, class_name, fee_head_name, month_name, amount, created_at FROM FeePlans";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $feePlans = [];
    while ($row = $result->fetch_assoc()) {
        $feePlans[] = $row;  // Add each row to the array
    }
    echo json_encode(['status' => 'success', 'data' => $feePlans]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No fee plans found']);
}

$conn->close();
?>
