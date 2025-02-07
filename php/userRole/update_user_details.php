<?php
require '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Enable PDO error mode
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Validate and sanitize user ID
        if (!isset($_POST['user_id']) || empty($_POST['user_id'])) {
            echo json_encode(['success' => false, 'message' => 'User ID is missing!']);
            exit;
        }

        $user_id = $_POST['user_id']; // Get user_id as it is

        // Ensure user exists before updating
        $checkStmt = $pdo->prepare("SELECT user_id FROM userRole WHERE user_id = :user_id");
        $checkStmt->execute([':user_id' => $user_id]);

        if ($checkStmt->rowCount() === 0) {
            echo json_encode(['success' => false, 'message' => 'User not found!']);
            exit;
        }

        // Sanitize inputs
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

        error_log("Received user_id: " . $_POST['user_id']);

        // Avatar Upload (if provided)
        $avatarUrl = null;
        if (!empty($_FILES['user_avatar']['name']) && $_FILES['user_avatar']['error'] === 0) {
            $uploadDir = __DIR__ . '/../assets/img/avatars/';
            $avatarName = time() . '_' . basename($_FILES['user_avatar']['name']);
            $avatarPath = $uploadDir . $avatarName;

            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            $fileType = mime_content_type($_FILES['user_avatar']['tmp_name']);

            if (!in_array($fileType, $allowedTypes)) {
                echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG and PNG allowed.']);
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

        $query .= " WHERE user_id = :user_id LIMIT 1"; // Ensures only one row is updated

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':fullname', $fullname, PDO::PARAM_STR);
        $stmt->bindParam(':role', $role, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':subject', $subject, PDO::PARAM_STR);
        $stmt->bindParam(':gender', $gender, PDO::PARAM_STR);
        $stmt->bindParam(':dob', $dob, PDO::PARAM_STR);
        $stmt->bindParam(':qualification', $qualification, PDO::PARAM_STR);
        $stmt->bindParam(':joining_date', $joining_date, PDO::PARAM_STR);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':status_change_cause', $status_change_cause, PDO::PARAM_STR);
        $stmt->bindParam(':change_by', $change_by, PDO::PARAM_STR);
        $stmt->bindParam(':salary', $salary, PDO::PARAM_STR);
        $stmt->bindParam(':aadhar_card', $aadhar_card, PDO::PARAM_STR);
        $stmt->bindParam(':user_address', $user_address, PDO::PARAM_STR);
        $stmt->bindParam(':bank_name', $bank_name, PDO::PARAM_STR);
        $stmt->bindParam(':branch_name', $branch_name, PDO::PARAM_STR);
        $stmt->bindParam(':account_number', $account_number, PDO::PARAM_STR);
        $stmt->bindParam(':ifsc_code', $ifsc_code, PDO::PARAM_STR);
        $stmt->bindParam(':account_type', $account_type, PDO::PARAM_STR);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

        if ($avatarUrl !== null) {
            $stmt->bindParam(':user_avatar', $avatarUrl, PDO::PARAM_STR);
        }

        // Execute query
        $updateSuccess = $stmt->execute();

        echo json_encode(['success' => $updateSuccess, 'message' => $updateSuccess ? 'User updated successfully!' : 'Update failed.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
