<?php
require '../db_connection.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['user_id'];
    $full_name = $_POST['full_name'];
    $qualification = $_POST['qualification'];
    $role = $_POST['role'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $dob = $_POST['dob'];
    $joining_date = $_POST['joining_date'];
    $status = $_POST['status'];
    $gender = $_POST['gender'];
    $salary = $_POST['salary'];
    $aadhar = $_POST['aadhar'];
    $subject = $_POST['subject'];
    $user_address = $_POST['user_address'];
    $bank_name = $_POST['bank_name'];
    $branch_name = $_POST['branch_name'];
    $account_number = $_POST['account_number'];
    $ifsc_code = $_POST['ifsc_code'];
    $account_type = $_POST['account_type'];

    try {
        $stmt = $pdo->prepare("UPDATE userRole SET
            fullname = ?, qualification = ?, role = ?, email = ?, phone = ?, dob = ?,
            joining_date = ?, status = ?, gender = ?, salary = ?, aadhar_card = ?,
            subject = ?, user_address = ?, bank_name = ?, branch_name = ?,
            account_number = ?, ifsc_code = ?, account_type = ? WHERE user_id = ?");

        $stmt->execute([
            $full_name, $qualification, $role, $email, $phone, $dob, $joining_date,
            $status, $gender, $salary, $aadhar, $subject, $user_address,
            $bank_name, $branch_name, $account_number, $ifsc_code, $account_type, $user_id
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "No changes made or invalid user ID"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>
