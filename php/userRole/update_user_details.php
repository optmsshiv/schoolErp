<?php
require '../db_connection.php';

header('Content-Type: application/json');

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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

    // Initialize avatar path
    $avatarPath = '';

    // Check if an image file is uploaded
    if (!empty($_FILES['avatar']['name'])) {
        $targetDir = "../uploads/avatars/"; // Ensure this directory exists
        $fileName = "user_" . $user_id . "_" . time() . "." . pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
        $targetFilePath = $targetDir . $fileName;

        // Move uploaded file to the target directory
        if (move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFilePath)) {
            $avatarPath = str_replace("../", "/", $targetFilePath); // Convert path for frontend use
        }
    }

    // Prepare SQL statement
    $query = "UPDATE users SET
        fullname = :full_name,
        qualification = :qualification,
        role = :role,
        email = :email,
        phone = :phone,
        dob = :dob,
        joining_date = :joining_date,
        status = :status,
        gender = :gender,
        salary = :salary,
        aadhar_card = :aadhar,
        subject = :subject,
        user_address = :user_address,
        bank_name = :bank_name,
        branch_name = :branch_name,
        account_number = :account_number,
        ifsc_code = :ifsc_code,
        account_type = :account_type";

    if ($avatarPath) {
        $query .= ", user_role_avatar = :avatarPath";
    }

    $query .= " WHERE user_id = :user_id";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':full_name', $full_name);
    $stmt->bindParam(':qualification', $qualification);
    $stmt->bindParam(':role', $role);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':dob', $dob);
    $stmt->bindParam(':joining_date', $joining_date);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':salary', $salary);
    $stmt->bindParam(':aadhar', $aadhar);
    $stmt->bindParam(':subject', $subject);
    $stmt->bindParam(':user_address', $user_address);
    $stmt->bindParam(':bank_name', $bank_name);
    $stmt->bindParam(':branch_name', $branch_name);
    $stmt->bindParam(':account_number', $account_number);
    $stmt->bindParam(':ifsc_code', $ifsc_code);
    $stmt->bindParam(':account_type', $account_type);
    $stmt->bindParam(':user_id', $user_id);

    if ($avatarPath) {
        $stmt->bindParam(':avatarPath', $avatarPath);
    }

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['avatar_path'] = $avatarPath;
    } else {
        $response['message'] = 'Database update failed.';
    }
}

echo json_encode($response);
?>
