<?php
// Include the database connection file
include '../php/db_connection.php';

// Check if the fee head name is set
if (isset($_POST['feeHeadName'])) {
    $feeHeadName = mysqli_real_escape_string($conn, $_POST['feeHeadName']);

    // Delete the fee head from the database
    $query = "DELETE FROM fee_heads WHERE fee_head_name = '$feeHeadName'";
    $result = mysqli_query($conn, $query);

    if ($result) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
}
?>
