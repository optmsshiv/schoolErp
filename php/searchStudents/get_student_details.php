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
    $sql = "SELECT s.first_name, s.last_name, s.father_name, s.class_name, s.roll_no,
                   sd.mother_name, sd.type AS student_type, sd.phone, sd.gender
            FROM students s
            LEFT JOIN students_details sd ON s.user_id = sd.user_id
            WHERE s.user_id = :user_id";

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
