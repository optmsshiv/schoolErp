<?php
require '../config/database.php'; // Include your database connection

$response = ['success' => false];

// Collect form data
$user_id = $_POST['user_id'];
$full_name = $_POST['full_name'];
$role = $_POST['role'];
$phone = $_POST['phone'];
$joining_date = $_POST['joining_date'];
$status = $_POST['status'];

// Prepare update query
$sql = "UPDATE users SET full_name=?, role=?, phone=?, joining_date=?, status=? WHERE user_id=?";
$stmt = $pdo->prepare($sql);
$success = $stmt->execute([$full_name, $role, $phone, $joining_date, $status, $user_id]);

if ($success) {
    $response['success'] = true;

    // Handle Avatar Upload
    if (!empty($_FILES['avatar']['name'])) {  // ✅ Only process if a new avatar is uploaded
        $targetDir = "../uploads/avatars/";
        $fileName = basename($_FILES["avatar"]["name"]);
        $targetFilePath = $targetDir . $fileName;
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

        // Allow only specific file types
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (in_array($fileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES["avatar"]["tmp_name"], $targetFilePath)) {
                // Update avatar path in the database
                $avatarSql = "UPDATE users SET user_role_avatar=? WHERE user_id=?";
                $stmt = $pdo->prepare($avatarSql);
                $stmt->execute([$targetFilePath, $user_id]);

                // ✅ Include avatar_path only when a new file is uploaded
                $response['avatar_path'] = $targetFilePath;
            }
        }
    }
} else {
    $response['error'] = "Failed to update user details.";
}

echo json_encode($response);
?>
