<?php
require '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $fullname = $_POST['fullname'];
    $role = $_POST['role'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $joining_date = $_POST['joining_date'];
    $status = $_POST['status'];
    $status_change_cause = $_POST['status_change_cause'];
    $change_by = $_POST['change_by'];
    $salary = $_POST['salary'];
    $aadhar_card = $_POST['aadhar_card'];
    $bank_name = $_POST['bank_name'];
    $branch_name = $_POST['branch_name'];
    $account_number = $_POST['account_number'];
    $ifsc_code = $_POST['ifsc_code'];
    $account_type = $_POST['account_type'];

    // Handle avatar upload
    if (!empty($_FILES['user_avatar']['name'])) {
        $uploadDir = '../uploads/avatars/';
        $avatarName = time() . '_' . $_FILES['user_avatar']['name'];
        $avatarPath = $uploadDir . $avatarName;

        if (move_uploaded_file($_FILES['user_avatar']['tmp_name'], $avatarPath)) {
            $avatarUrl = 'uploads/avatars/' . $avatarName;
        } else {
            echo json_encode(['success' => false, 'message' => 'Avatar upload failed']);
            exit;
        }
    }

    try {
        $query = "UPDATE users SET fullname = :fullname, role = :role, email = :email, phone = :phone,
                  joining_date = :joining_date, status = :status, status_change_cause = :status_change_cause,
                  change_by = :change_by, salary = :salary, aadhar_card = :aadhar_card,
                  bank_name = :bank_name, branch_name = :branch_name, account_number = :account_number,
                  ifsc_code = :ifsc_code, account_type = :account_type";

        if (!empty($avatarUrl)) {
            $query .= ", user_role_avatar = :user_avatar";
        }

        $query .= " WHERE user_id = :user_id";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':fullname', $fullname);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':joining_date', $joining_date);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':status_change_cause', $status_change_cause);
        $stmt->bindParam(':change_by', $change_by);
        $stmt->bindParam(':salary', $salary);
        $stmt->bindParam(':aadhar_card', $aadhar_card);
        $stmt->bindParam(':bank_name', $bank_name);
        $stmt->bindParam(':branch_name', $branch_name);
        $stmt->bindParam(':account_number', $account_number);
        $stmt->bindParam(':ifsc_code', $ifsc_code);
        $stmt->bindParam(':account_type', $account_type);
        $stmt->bindParam(':user_id', $user_id);

        if (!empty($avatarUrl)) {
            $stmt->bindParam(':user_avatar', $avatarUrl);
        }

        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
