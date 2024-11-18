<?php
// Database connection
include '../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $feeHead = $_POST['feeHead'];
    $className = $_POST['className'];
    $month = $_POST['month'];
    $feeAmount = $_POST['feeAmount'];

    if (empty($feeHead) || empty($className) || empty($month) || empty($feeAmount)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    // Insert query
    $sql = "INSERT INTO FeePlans (fee_head_id, class, month, fee_amount)
            VALUES ((SELECT fee_head_id FROM feeHeads WHERE fee_head_name = ?), ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $feeHead, $className, $month, $feeAmount);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => $conn->error]);
    }

    $stmt->close();
    $conn->close();
}
?>
