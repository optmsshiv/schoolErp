<?php
// Include the database connection
include '../db_connection.php';

try {
    // SQL to fetch hostel and student details
    $sql = "SELECT
                students.user_id AS student_id,
                CONCAT(students.first_name, ' ', students.last_name) AS student_name,
                students.father_name AS father_name,
                students.phone AS mobile_number,
                hostels.hostel_name,
                hostels.hostel_fee,
                hostels.start_date,
                hostels.leave_date
            FROM students
            LEFT JOIN hostels ON students.hostel_id = hostels.hostel_id
            WHERE students.day_hosteler = 'Hosteler'";  // Add condition to filter by 'Hosteler'

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

     // Add serial number to each result
    $serial_number = 1;
    foreach ($result as &$row) {
        $row['serial_number'] = $serial_number++;
    }

    // Count the total number of students
    $total_students = count($result);

    // Respond with JSON data, including the total student count
    echo json_encode([
        "status" => "success",
        "data" => $result,
        "total_students" => $total_students
    ]);

} catch (PDOException $e) {
    // Log and respond with error
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Failed to fetch hostel details."]);
}
?>
