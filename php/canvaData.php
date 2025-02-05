<?php
// Include database connection
include '../php/db_connection.php';

// Function to generate a random password
function generatePassword($length = 8) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomPassword = '';
    for ($i = 0; $i < $length; $i++) {
        $randomPassword .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomPassword;
}

// Function to generate a unique user ID based on the user's name
function generateUserId($fullname) {
    $uniquePart = sprintf('%04d', rand(0, 9999)); // Generates a 4-digit number with leading zeros if needed
    $namePart = strtoupper(substr($fullname, 0, 3)); // Example: John -> JOH
    return $namePart . $uniquePart; // Example: JOH1234
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Capture form data
        $fullname = $_POST['basicFullname'] ?? '';
        $role = $_POST['basicPost'] ?? '';
        $email = $_POST['basicEmail'] ?? '';
        $phoneNumber = $_POST['phoneNumber'] ?? '';
        $joiningDate = $_POST['basicDate'] ?? ''; // YYYY-MM-DD from form
        $status = $_POST['basicStatus'] ?? 'Pending';
        $salary = $_POST['basicSalary'] ?? '0';

        // Format joining date to DD-MM-YYYY
       // $formattedJoiningDate = !empty($joiningDate) ? date('d-m-Y', strtotime($joiningDate)) : date('d-m-Y');

        // Generate user ID and password
        $userId = generateUserId($fullname);
        $password = generatePassword(6);
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert query
        $sql = "INSERT INTO userRole (user_id, fullname, role, email, phone, joining_date, status, salary, password)
                VALUES (:user_id, :fullname, :role, :email, :phone, :joining_date, :status, :salary, :password)";

        // Prepare and execute statement
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':user_id' => $userId,
            ':fullname' => $fullname,
            ':role' => $role,
            ':email' => $email,
            ':phone' => $phoneNumber,
            ':joining_date' => $joiningDate, // Storing in YYYY-MM-DD format for consistency
            ':status' => $status,
            ':salary' => $salary,
            ':password' => $hashedPassword
        ]);

        // Return success response with properly formatted date
        echo json_encode([
            'success' => true,
            'user_id' => $user_id,
            'fullname' => $fullname,
            'role' => $role ?? 'N/A',
            'phone' => $phoneNumber,
            'joining_date' => $joiningDate, // ✅ Formatted DD-MM-YYYY
            'status' => $status,
            'password' => $password,
        ]);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
