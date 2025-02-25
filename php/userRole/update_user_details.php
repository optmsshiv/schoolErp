<?php
require '../db_connection.php'; // Ensure correct path

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['user_id'])) {
    $userId = $_POST['user_id'];
    $fullName = $_POST['fullname'];
    $qualification = $_POST['qualification'];
    $role = $_POST['role'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $dob = $_POST['dob'];
    $joiningDate = $_POST['joining_date'];
    $status = $_POST['status'];
    $gender = $_POST['gender'];
    $salary = $_POST['salary'];
    $aadhar = $_POST['aadhar_card'];
    $subject = $_POST['subject'];
    $address = $_POST['user_address'];
    $bankName = $_POST['bank_name'];
    $branchName = $_POST['branch_name'];
    $accountNumber = $_POST['account_number'];
    $ifsc = $_POST['ifsc_code'];
    $accountType = $_POST['account_type'];

    // Handle avatar upload
    $avatarFileName = null;
    if (!empty($_FILES['avatar']['name'])) {
        $targetDir = "/assets/img/avatars/";
        $avatarFileName = time() . "_" . basename($_FILES["avatar"]["name"]);
        $targetFilePath = $targetDir . $avatarFileName;
        $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

        // Validate file type (only allow images)
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array(strtolower($fileType), $allowedTypes)) {
            echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.']);
            exit;
        }

        // Move file to upload folder
        if (!move_uploaded_file($_FILES["avatar"]["tmp_name"], $targetFilePath)) {
            echo json_encode(['success' => false, 'message' => 'Error uploading file.']);
            exit;
        }
    }

    try {
        $sql = "UPDATE userRole SET
            fullname = :fullname,
            qualification = :qualification,
            role = :role,
            email = :email,
            phone = :phone,
            dob = :dob,
            joining_date = :joining_date,
            status = :status,
            gender = :gender,
            salary = :salary,
            aadhar_card = :aadhar_card,
            subject = :subject,
            user_address = :user_address,
            bank_name = :bank_name,
            branch_name = :branch_name,
            account_number = :account_number,
            ifsc_code = :ifsc_code,
            account_type = :account_type";

        // Update avatar only if a new file was uploaded
        if ($avatarFileName) {
            $sql .= ", avatar = :avatar";
        }

        $sql .= " WHERE user_id = :user_id";

        $stmt = $pdo->prepare($sql);
        $params = [
            ':fullname' => $fullName,
            ':qualification' => $qualification,
            ':role' => $role,
            ':email' => $email,
            ':phone' => $phone,
            ':dob' => $dob,
            ':joining_date' => $joiningDate,
            ':status' => $status,
            ':gender' => $gender,
            ':salary' => $salary,
            ':aadhar_card' => $aadhar,
            ':subject' => $subject,
            ':user_address' => $address,
            ':bank_name' => $bankName,
            ':branch_name' => $branchName,
            ':account_number' => $accountNumber,
            ':ifsc_code' => $ifsc,
            ':account_type' => $accountType,
            ':user_id' => $userId
        ];

        if ($avatarFileName) {
            $params[':avatar'] = $avatarFileName;
        }

        $stmt->execute($params);

        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
