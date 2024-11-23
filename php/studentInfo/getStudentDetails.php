<?php
include '../db_connection.php'; // Ensure this includes your db_connection.php file

if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    // Check if the user_id is not empty
    if (empty($user_id)) {
        echo json_encode(["error" => "Invalid user_id"]);
        exit();
    }

    // Use the correct PDO object ($pdo)
    $sql = "SELECT * FROM students WHERE user_id = ?";
    $stmt = $pdo->prepare($sql); // Changed from $conn to $pdo
    $stmt->bindParam(1, $user_id, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(["error" => "Student not found"]);
    }
} else {
    echo json_encode(["error" => "No user_id provided"]);
}

?>
