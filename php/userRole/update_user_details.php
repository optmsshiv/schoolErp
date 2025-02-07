<?php
require '../db_connection.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json'); // Ensure JSON response

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Fetch all input values
        $user_id = $_POST['user_id'] ?? null;
        $full_name = $_POST['full_name'] ?? '';
        $qualification = $_POST['qualification'] ?? '';
        $role = $_POST['role'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $dob = $_POST['dob'] ?? '';
        $joining_date = $_POST['joining_date'] ?? '';
        $status = $_POST['status'] ?? '';
        $gender = $_POST['gender'] ?? '';
        $salary = $_POST['salary'] ?? '';
        $aadhar = $_POST['aadhar'] ?? '';
        $subject = $_POST['subject'] ?? '';
        $user_address = $_POST['user_address'] ?? '';
        $bank_name = $_POST['bank_name'] ?? '';
        $branch_name = $_POST['branch_name'] ?? '';
        $account_number = $_POST['account_number'] ?? '';
        $ifsc_code = $_POST['ifsc_code'] ?? '';
        $account_type = $_POST['account_type'] ?? '';

        if (!$user_id) {
            throw new Exception("User ID is required.");
        }

        // Initialize avatar path
        $avatarPath = '';

        // Handle file upload
        if (!empty($_FILES['avatar']['name'])) {
            $uploadDir = $_SERVER['DOCUMENT_ROOT'] . "/assets/img/avatars/"; // Ensure this directory exists
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true); // Create the directory if it doesn't exist
            }

            $fileExt = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
            $fileName = "user_" . $user_id . "_" . time() . "." . $fileExt;
            $targetFilePath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFilePath)) {
                $avatarPath = "/assets/img/avatars/" . $fileName; // Adjust path for frontend usage
            } else {
                throw new Exception("Failed to upload the file.");
            }
        }

        // Prepare SQL statement
        $query = "UPDATE userRole SET
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

        // Bind parameters
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

        // Execute query
        if ($stmt->execute()) {
            $response['success'] = true;
            if ($avatarPath) {
                $response['avatar_path'] = $avatarPath;
            }
        } else {
            throw new Exception("Database update failed.");
        }
    } catch (Exception $e) {
        $response['error'] = $e->getMessage();
    }
}

// Return JSON response
echo json_encode($response);
?>
