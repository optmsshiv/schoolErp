<?php
// Include the database connection
global $pdo;
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

// Check if fee_data exists in the request
if (empty($data['fee_data']) || !is_array($data['fee_data'])) {
    echo json_encode(["success" => false, "error" => "Fee data is missing or invalid."]);
    exit;
}

try {
    // Prepare SQL statement to insert data into feeDetails table
    $sql = "INSERT INTO feeDetails (
                user_id, student_name, receipt_no, month, fee_type, amount, hostel_fee, transport_fee,
                concession_amount, received_amount, due_amount, pending_amount, advanced_amount,
                total_amount, payment_status, payment_type, bank_name, payment_date, remark
            )
            VALUES (
                :user_id, :student_name, :receipt_no, :month, :fee_type, :amount, :hostel_fee, :transport_fee,
                :concession_amount, :received_amount, :due_amount, :pending_amount, :advanced_amount,
                :total_amount, :payment_status, :payment_type, :bank_name, :payment_date, :remark
            )";


     // Extract months, fee types, and amounts
        $months = array_column($data['fee_data'], 'month');
        $feeTypes = array_column($data['fee_data'], 'feeType');
        $amounts = array_column($data['fee_data'], 'amount');

      // Concatenate months, feeTypes, and amounts into strings
         $commaSeparatedMonths = implode(', ', $months);
         $commaSeparatedFeeTypes = implode(', ', $feeTypes);
         $commaSeparatedAmounts = implode(', ', $amounts);

      // If payment_status is pending, set due_amount = total_amount
            if ($data['payment_status'] === "pending") {
            $data['pending_amount'] = $data['total_amount'];
             }

        // Prepare the statement for each fee data entry
        $stmt = $pdo->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_STR); // Make sure the user_id is passed as a string
        $stmt->bindParam(':student_name', $data['student_name'], PDO::PARAM_STR); // Make sure the student_name is passed as a string
        $stmt->bindParam(':receipt_no', $data['receipt_no'], PDO::PARAM_STR); // Make sure the receipt_no is passed as a string
        $stmt->bindParam(':month', $commaSeparatedMonths, PDO::PARAM_STR); // Store months as comma-separated
        $stmt->bindParam(':fee_type', $commaSeparatedFeeTypes, PDO::PARAM_STR); // Store fee types as comma-separated
        $stmt->bindParam(':amount', $commaSeparatedAmounts, PDO::PARAM_STR); // Store amounts as comma-separated
        $stmt->bindParam(':hostel_fee', $data['hostel_fee'], PDO::PARAM_STR); // Make sure the hostel_fee is passed as a string
        $stmt->bindParam(':transport_fee', $data['transport_fee'], PDO::PARAM_STR); // Make sure the transport_fee is passed as a string

        $stmt->bindParam(':concession_amount', $data['concession_amount'], PDO::PARAM_STR); // Make sure the concession_amount is passed as a string
        $stmt->bindParam(':received_amount', $data['received_amount'], PDO::PARAM_STR);
        $stmt->bindParam(':due_amount', $data['due_amount'], PDO::PARAM_STR);
        $stmt->bindParam(':pending_amount', $data['pending_amount'], PDO::PARAM_STR);
        $stmt->bindParam(':advanced_amount', $data['advanced_amount'], PDO::PARAM_STR);
        $stmt->bindParam(':total_amount', $data['total_amount'], PDO::PARAM_STR);
        $stmt->bindParam(':payment_status', $data['payment_status'], PDO::PARAM_STR); // Make sure the payment_status is passed as a string
        $stmt->bindParam(':payment_type', $data['payment_type'], PDO::PARAM_STR); // Make sure the payment_type is passed as a string
        $stmt->bindParam(':bank_name', $data['bank_name'], PDO::PARAM_STR); // Make sure the bank_name is passed as a string
        $stmt->bindParam(':payment_date', $data['payment_date'], PDO::PARAM_STR); // Make sure the payment_date is passed as a string
        $stmt->bindParam(':remark', $data['remark'], PDO::PARAM_STR);

        // Execute the statement for each fee entry
        $stmt->execute();

    // Output the comma-separated month and fee type
    echo json_encode([
        "success" => true,
        "months" => $commaSeparatedMonths,
        "fee_types" => $commaSeparatedFeeTypes,
        "amounts" => $commaSeparatedAmounts,
        "pending_amount" => $data['pending_amount']

    ]);

    // Return success response
   // echo json_encode(["success" => true]);

} catch (PDOException $e) {
    // Log the error
    error_log("Database insertion error: " . $e->getMessage(), 0);

    // Return an error response
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
