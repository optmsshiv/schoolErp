<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database connection
include '../db_connection.php';

try {
    // Get the unique identifier (user_id) from the request
    $user_id = $_GET['user_id'] ?? '';

    if (empty($user_id)) {
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }

    // Query to fetch student details
    $sql = "SELECT first_name, last_name, father_name, class_name, roll_no,
                   mother_name, type AS student_type, phone, gender
            FROM students
            LEFT JOIN students_details sd ON user_id = user_id
            WHERE user_id = :user_id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode($data);
    } else {
        echo json_encode(['error' => 'No data found']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
