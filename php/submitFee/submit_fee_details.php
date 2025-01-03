<?php
// Include the database connection
include('../db_connection.php');

// Get JSON input from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate user_id existence in students table
$checkUserSql = "SELECT COUNT(*) FROM students WHERE user_id = :user_id";
$checkStmt = $pdo->prepare($checkUserSql);
$checkStmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_STR); // Make sure the user_id is passed as a string
$checkStmt->execute();
$userCount = $checkStmt->fetchColumn();

// If the user_id does not exist in students table, return an error
if ($userCount == 0) {
    echo json_encode(["success" => false, "error" => "User ID does not exist in the students table."]);
    exit;
}

// Proceed with insertion into feeDetails table
$sql = "INSERT INTO feeDetails (
            user_id, student_name, receipt_no, month, fee_type, hostel_fee, transport_fee,
            additional_amount, concession_amount, received_amount, due_amount, advanced_amount,
            total_amount, payment_status, payment_type, bank_name, payment_date, remark
        )
        VALUES (
            :user_id, :student_name, :receipt_no, :month, :fee_type, :hostel_fee, :transport_fee,
            :additional_amount, :concession_amount, :received_amount, :due_amount, :advanced_amount,
            :total_amount, :payment_status, :payment_type, :bank_name, :payment_date, :remark
        )";

try {
    // Prepare the statement
    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_STR); // Bind as string
    $stmt->bindParam(':student_name', $data['student_name'], PDO::PARAM_STR);
    $stmt->bindParam(':receipt_no', $data['receipt_no'], PDO::PARAM_STR);
    $stmt->bindParam(':month', $data['month'], PDO::PARAM_STR);
    $stmt->bindParam(':fee_type', $data['fee_type'], PDO::PARAM_STR);
    $stmt->bindParam(':hostel_fee', $data['hostel_fee'], PDO::PARAM_STR);
    $stmt->bindParam(':transport_fee', $data['transport_fee'], PDO::PARAM_STR);
    $stmt->bindParam(':additional_amount', $data['additional_amount'], PDO::PARAM_STR);
    $stmt->bindParam(':concession_amount', $data['concession_amount'], PDO::PARAM_STR);
    $stmt->bindParam(':received_amount', $data['received_amount'], PDO::PARAM_STR);
    $stmt->bindParam(':due_amount', $data['due_amount'], PDO::PARAM_STR);
    $stmt->bindParam(':advanced_amount', $data['advanced_amount'], PDO::PARAM_STR);
    $stmt->bindParam(':total_amount', $data['total_amount'], PDO::PARAM_STR);
    $stmt->bindParam(':payment_status', $data['payment_status'], PDO::PARAM_STR);
    $stmt->bindParam(':payment_type', $data['payment_type'], PDO::PARAM_STR);
    $stmt->bindParam(':bank_name', $data['bank_name'], PDO::PARAM_STR);
    $stmt->bindParam(':payment_date', $data['payment_date'], PDO::PARAM_STR);
    $stmt->bindParam(':remark', $data['remark'], PDO::PARAM_STR);

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    // Log the error
    error_log("Database insertion error: " . $e->getMessage(), 0);

    // Return an error response
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
