<?php
require '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Enable PDO error mode
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Sanitize and validate inputs
        $user_id = filter_input(INPUT_POST, 'user_id', FILTER_SANITIZE_NUMBER_INT);
        $fullname = htmlspecialchars($_POST['fullname'], ENT_QUOTES, 'UTF-8');
        $role = htmlspecialchars($_POST['role'], ENT_QUOTES, 'UTF-8');
        $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ? $_POST['email'] : null;
        $subject = htmlspecialchars($_POST['subject'], ENT_QUOTES, 'UTF-8');
        $gender = htmlspecialchars($_POST['gender'], ENT_QUOTES, 'UTF-8');
        $phone = htmlspecialchars($_POST['phone'], ENT_QUOTES, 'UTF-8');
        $dob = htmlspecialchars($_POST['dob'], ENT_QUOTES, 'UTF-8');
        $qualification = htmlspecialchars($_POST['qualification'], ENT_QUOTES, 'UTF-8');
        $joining_date = htmlspecialchars($_POST['joining_date'], ENT_QUOTES, 'UTF-8');
        $status = htmlspecialchars($_POST['status'], ENT_QUOTES, 'UTF-8');
        $status_change_cause = htmlspecialchars($_POST['status_change_cause'], ENT_QUOTES, 'UTF-8');
        $change_by = htmlspecialchars($_POST['change_by'], ENT_QUOTES, 'UTF-8');
        $salary = filter_var($_POST['salary'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $aadhar_card = htmlspecialchars($_POST['aadhar_card'], ENT_QUOTES, 'UTF-8');
        $user_address = htmlspecialchars($_POST['user_address'], ENT_QUOTES, 'UTF-8');
        $bank_name = htmlspecialchars($_POST['bank_name'], ENT_QUOTES, 'UTF-8');
        $branch_name = htmlspecialchars($_POST['branch_name'], ENT_QUOTES, 'UTF-8');
        $account_number = htmlspecialchars($_POST['account_number'], ENT_QUOTES, 'UTF-8');
        $ifsc_code = htmlspecialchars($_POST['ifsc_code'], ENT_QUOTES, 'UTF-8');
        $account_type = htmlspecialchars($_POST['account_type'], ENT_QUOTES, 'UTF-8');

        // Validate email
        if (!$email) {
            echo json_encode(['success' => false, 'message' => 'Invalid email format']);
            exit;
        }

        // Handle avatar upload
        $avatarUrl = null;
        if (!empty($_FILES['user_avatar']['name'])) {
            $uploadDir = __DIR__ . '/../assets/img/avatars/';
            $avatarName = time() . '_' . basename($_FILES['user_avatar']['name']);
            $avatarPath = $uploadDir . $avatarName;

            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true); // Create directory if it doesn't exist
            }

            // Validate file type (JPG, PNG only)
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!in_array(mime_content_type($_FILES['user_avatar']['tmp_name']), $allowedTypes)) {
                echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG and PNG allowed.']);
                exit;
            }

            // Validate file upload success
            if ($_FILES['user_avatar']['error'] !== UPLOAD_ERR_OK) {
                echo json_encode(['success' => false, 'message' => 'File upload error.']);
                exit;
            }

            if (move_uploaded_file($_FILES['user_avatar']['tmp_name'], $avatarPath)) {
                $avatarUrl = '/assets/img/avatars/' . $avatarName;
            } else {
                echo json_encode(['success' => false, 'message' => 'Avatar upload failed']);
                exit;
            }
        }

        // Update query
        $query = "UPDATE userRole SET
                  fullname = :fullname, role = :role, email = :email, phone = :phone,
                  subject = :subject, gender = :gender, dob = :dob, qualification = :qualification,
                  joining_date = :joining_date, status = :status, status_change_cause = :status_change_cause,
                  change_by = :change_by, salary = :salary, aadhar_card = :aadhar_card, user_address = :user_address,
                  bank_name = :bank_name, branch_name = :branch_name, account_number = :account_number,
                  ifsc_code = :ifsc_code, account_type = :account_type";

        if ($avatarUrl !== null) {
            $query .= ", user_role_avatar = :user_avatar";
        }

        $query .= " WHERE user_id = :user_id";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':fullname', $fullname);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':dob', $dob);
        $stmt->bindParam(':qualification', $qualification);
        $stmt->bindParam(':joining_date', $joining_date);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':status_change_cause', $status_change_cause);
        $stmt->bindParam(':change_by', $change_by);
        $stmt->bindParam(':salary', $salary);
        $stmt->bindParam(':aadhar_card', $aadhar_card);
        $stmt->bindParam(':user_address', $user_address);
        $stmt->bindParam(':bank_name', $bank_name);
        $stmt->bindParam(':branch_name', $branch_name);
        $stmt->bindParam(':account_number', $account_number);
        $stmt->bindParam(':ifsc_code', $ifsc_code);
        $stmt->bindParam(':account_type', $account_type);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

        if ($avatarUrl !== null) {
            $stmt->bindParam(':user_avatar', $avatarUrl);
        }

        echo json_encode(['success' => $stmt->execute()]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
