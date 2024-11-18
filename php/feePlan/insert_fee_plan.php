<?php
include 'db_connection.php';

$feeHead = $_POST['feeHead'];
$className = $_POST['className'];
$monthName = $_POST['monthName']; // Comma-separated string of months
$amount = $_POST['amount'];

// Insert the fee plan into the database
$query = "INSERT INTO feePlans (fee_head_id, class_id, monthName, fee_amount)
          VALUES ('$feeHead', '$className', '$monthName', '$amount')";

if (mysqli_query($conn, $query)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
}
?>
