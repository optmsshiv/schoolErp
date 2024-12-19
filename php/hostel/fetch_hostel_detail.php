<?php
include '../db_connection.php';

$studentId = $_GET['studentId'];

try {
    $sql = "
        SELECT
            s.id,
            s.name AS student_name,
            h.hostel_name,
            h.hostel_fee,
            sh.start_date,
            sh.leave_date
        FROM student_hostels sh
        JOIN students s ON sh.id = s.id
        JOIN hostels h ON sh.hostel_id = h.hostel_id
        WHERE s.id = :studentId
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':studentId' => $studentId]);
    $result = $stmt->fetchAll();

    echo json_encode(["status" => "success", "data" => $result]);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage(), 0);
    echo json_encode(["status" => "error", "message" => "Failed to fetch hostel details."]);
}
?>
