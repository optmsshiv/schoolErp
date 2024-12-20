<?php
// Include the database connection
include '../db_connection.php';

try {
    // SQL to fetch hostel and student details
    $sql = "SELECT
                students.user_id AS student_id,
                students.name AS student_name,
                hostels.hostel_name,
                hostels.hostel_fee,
                hostels.start_date,
                hostels.leave_date
            FROM students
            LEFT JOIN hostels ON students.hostel_id = hostels.hostel_id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Respond with JSON data
    echo json_encode(["status" => "success", "data" => $result]);
} catch (PDOException $e) {
    // Log and respond with error
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Failed to fetch hostel details."]);
}
?>
