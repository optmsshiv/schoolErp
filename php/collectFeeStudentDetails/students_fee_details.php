<?php
// Database connection
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Query to fetch student data along with hostel fee
    $sql = "SELECT
                CONCAT(students.first_name, ' ', students.last_name) AS full_name,
                students.class_name,
                students.phone,
                students.date_of_birth,
                students.gender,
                students.father_name,
                students.mother_name,
                students.roll_no,
                students.day_hosteler,
                students.admission_no,
                students.hostel_id,
                students.transport_id
            FROM students";

    $stmt = $pdo->query($sql);  // PDO query execution

    $data = [];
    if ($stmt->rowCount() > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
    }

    echo json_encode($data);
} catch (PDOException $e) {
    // Log the error for debugging
    error_log("Error fetching student data: " . $e->getMessage());

    // Return error message
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch student data']);
}
?>
