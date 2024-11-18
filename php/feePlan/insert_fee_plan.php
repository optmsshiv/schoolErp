<?php
include '../db_connection.php';

$feeHead = $_POST['feeHead'];
$className = $_POST['className'];
$month = $_POST['month']; // Comma-separated months (e.g., "January,February,March")
$amount = $_POST['amount'];

// Insert the fee plan for multiple months in one record
$query = "INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount)
          VALUES ('$feeHead', '$className', '$month', '$amount')";

if (mysqli_query($conn, $query)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
}
?>
